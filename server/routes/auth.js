import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';
const prisma = new PrismaClient();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    // Return user data and token (excluding password)
    const { password: _, ...userData } = user;
    res.status(201).json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check admin credentials
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        const token = jwt.sign({ userId: admin.id, isAdmin: true }, process.env.JWT_SECRET, {
          expiresIn: '24h'
        });

        const { password: _, ...adminData } = admin;
        return res.json({
          user: adminData,
          token
        });
      }
    }

    // If not admin, check regular user credentials
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, isAdmin: false }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    // Return user data and token (excluding password)
    const { password: _, ...userData } = user;
    res.json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Check if the user is an admin based on the token
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

    if (decoded.isAdmin) {
      const admin = await prisma.admin.findUnique({
        where: { id: req.userId }
      });

      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      const { password: _, ...adminData } = admin;
      return res.json({ ...adminData, isAdmin: true });
    }

    // If not admin, get regular user data
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    res.json({ ...userData, isAdmin: false });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== req.userId) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { name, email }
    });

    const { password: _, ...userData } = updatedUser;
    res.json(userData);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Delete user account
router.delete('/profile', authMiddleware, async (req, res) => {
  try {
    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete cart items first
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: req.userId
          }
        }
      });

      // Delete cart
      await tx.cart.deleteMany({
        where: {
          userId: req.userId
        }
      });

      // Delete order items
      await tx.orderItem.deleteMany({
        where: {
          order: {
            userId: req.userId
          }
        }
      });

      // Delete orders
      await tx.order.deleteMany({
        where: {
          userId: req.userId
        }
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: req.userId }
      });
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
});

export default router;
