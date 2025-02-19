import express from 'express';
import { PrismaClient } from '@prisma/client';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 9 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build the where clause based on filters
    const where = {};

    // Category filter
    if (category) {
      where.categoryId = parseInt(category);
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Search by title
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: parseInt(limit)
    });

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        images: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create a new product
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, price, images, categoryId } = req.body;
    
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Ensure images is an array and extract URLs correctly
    const imageUrls = Array.isArray(images) ? images.map(img => ({
      url: typeof img === 'string' ? img : (typeof img.url === 'string' ? img.url : img.url.url)
    })) : [];

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        images: {
          create: imageUrls
        }
      },
      include: {
        category: true,
        images: true
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Update a product
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, images, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        images: {
          deleteMany: {},
          create: images.map(url => ({ url }))
        }
      },
      include: {
        category: true,
        images: true
      }
    });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

export default router;
