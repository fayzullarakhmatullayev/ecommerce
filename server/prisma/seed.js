import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.join(__dirname, '..', 'storage');

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}.jpg`;
    const filePath = path.join(storageDir, fileName);

    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    return fileName;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    return products.map((product) => {
      // Generate additional image URLs by adding suffixes to the original image URL
      const baseImageUrl = product.image;
      const imageUrls = [baseImageUrl, baseImageUrl, baseImageUrl];

      return {
        title: product.title,
        description: product.description,
        price: parseFloat(product.price),
        imageUrls: imageUrls,
        category: product.category
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function main() {
  try {
    // Ensure storage directory exists
    if (!fs.existsSync(storageDir)) {
      await fs.promises.mkdir(storageDir, { recursive: true });
    }

    // Clear existing data
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Fetch products from external API
    const products = await fetchProducts();

    // Create categories first
    const categories = [...new Set(products.map((p) => p.category))];
    const categoryMap = {};

    for (const categoryName of categories) {
      const category = await prisma.category.create({
        data: { name: categoryName }
      });
      categoryMap[categoryName] = category.id;
    }

    // Insert products with category relationships
    for (const product of products) {
      const { category, imageUrls, ...productData } = product;

      // Download and store images
      const downloadedImages = [];
      for (const imageUrl of imageUrls) {
        const fileName = await downloadImage(imageUrl);
        if (fileName) {
          downloadedImages.push(fileName);
        }
      }

      await prisma.product.create({
        data: {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          categoryId: categoryMap[category],
          images: {
            create: downloadedImages.map((fileName) => ({ url: `/storage/${fileName}` }))
          }
        }
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
