import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's cart items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: true }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.userId,
          items: {
            create: {
              productId: parseInt(productId),
              quantity: parseInt(quantity)
            }
          }
        },
        include: { items: true }
      });
    } else {
      // Check if item already exists in cart
      const existingItem = cart.items.find((item) => item.productId === parseInt(productId));

      if (existingItem) {
        // Update existing item quantity
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: parseInt(quantity) }
        });
      } else {
        // Add new item to cart
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: parseInt(productId),
            quantity: parseInt(quantity)
          }
        });
      }
    }

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/:itemId', authMiddleware, async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== req.userId) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity: parseInt(quantity) }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:itemId', authMiddleware, async (req, res) => {
  const { itemId } = req.params;

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== req.userId) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
