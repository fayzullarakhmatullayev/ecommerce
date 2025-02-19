import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing admins
    await prisma.admin.deleteMany();
    
    // Create admin users
    const admins = [
      {
        email: 'admin@example.com',
        name: 'Super Admin',
        password: await bcrypt.hash('admin123', 10)
      },
      {
        email: 'manager@example.com',
        name: 'System Manager',
        password: await bcrypt.hash('manager123', 10)
      }
    ];
    
    for (const adminData of admins) {
      await prisma.admin.create({
        data: adminData
      });
    }
    
    console.log('Admin users seeded successfully');
  } catch (error) {
    console.error('Error seeding admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();