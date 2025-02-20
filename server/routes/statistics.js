import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get daily sales statistics
router.get('/daily', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const dailyStats = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        },
        status: 'DELIVERED'
      },
      _sum: {
        total: true
      },
      _count: true
    });

    res.json({
      totalSales: dailyStats._sum.total || 0,
      orderCount: dailyStats._count || 0,
      date: startOfDay.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Daily statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch daily statistics' });
  }
});

// Get weekly sales statistics
router.get('/weekly', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyStats = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        CAST(COUNT(*) AS INTEGER) as orderCount,
        CAST(COALESCE(SUM(total), 0) AS DECIMAL) as totalSales
      FROM "Order"
      WHERE "createdAt" >= ${startOfWeek}
        AND status = 'DELIVERED'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    res.json(weeklyStats);
  } catch (error) {
    console.error('Weekly statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly statistics' });
  }
});

// Get monthly sales statistics
router.get('/monthly', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        CAST(COUNT(*) AS INTEGER) as orderCount,
        CAST(COALESCE(SUM(total), 0) AS DECIMAL) as totalSales
      FROM "Order"
      WHERE "createdAt" >= ${startOfMonth}
        AND status = 'DELIVERED'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    res.json(monthlyStats);
  } catch (error) {
    console.error('Monthly statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly statistics' });
  }
});

// Get best selling products
router.get('/best-selling', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bestSellingProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10,
      where: {
        order: {
          status: 'DELIVERED'
        }
      }
    });

    // Fetch product details for the best-selling products
    const productsWithDetails = await Promise.all(
      bestSellingProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { 
            category: true,
            images: true
          }
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
          totalRevenue: item._sum.price
        };
      })
    );

    res.json(productsWithDetails.filter(product => product !== null));
  } catch (error) {
    console.error('Best-selling products error:', error);
    res.status(500).json({ error: 'Failed to fetch best-selling products' });
  }
});

export default router;
