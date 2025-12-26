import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default test user
  const hashedPassword = await bcrypt.hash("test", 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Seeded test user:", testUser.email);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Seeded admin user:", adminUser.email);

  // Create sample products
  const products = [
    {
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
      price: 199.99,
      category: "Electronics",
      stock: 50,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      name: "Running Shoes",
      description: "Comfortable running shoes with breathable mesh and cushioned sole",
      price: 89.99,
      category: "Shoes",
      stock: 30,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },
    {
      name: "Cotton T-Shirt",
      description: "100% organic cotton t-shirt, available in multiple colors",
      price: 24.99,
      category: "Clothing",
      stock: 100,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    },
    {
      name: "Laptop Stand",
      description: "Adjustable aluminum laptop stand for ergonomic workspace",
      price: 49.99,
      category: "Electronics",
      stock: 25,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    },
    {
      name: "Leather Jacket",
      description: "Genuine leather jacket with classic design",
      price: 299.99,
      category: "Clothing",
      stock: 15,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    },
    {
      name: "Casual Sneakers",
      description: "Stylish casual sneakers perfect for everyday wear",
      price: 79.99,
      category: "Shoes",
      stock: 40,
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
    },
    {
      name: "Smart Watch",
      description: "Feature-rich smartwatch with fitness tracking and notifications",
      price: 249.99,
      category: "Electronics",
      stock: 35,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      name: "Denim Jeans",
      description: "Classic fit denim jeans with stretch comfort",
      price: 59.99,
      category: "Clothing",
      stock: 60,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    },
    {
      name: "High-Top Sneakers",
      description: "Basketball-inspired high-top sneakers with premium materials",
      price: 129.99,
      category: "Shoes",
      stock: 20,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking",
      price: 29.99,
      category: "Electronics",
      stock: 75,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    },
  ];

  // Delete existing products and create new ones
  await prisma.product.deleteMany({});
  
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

