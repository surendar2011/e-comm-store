"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts({
  search,
  category,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  search?: string;
  category?: string;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}) {
  try {
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch products";
    return { success: false, products: [], error: errorMessage };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.isActive) {
      return { success: false, product: null, error: "Product not found" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("Error fetching product:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
    return { success: false, product: null, error: errorMessage };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return categories.map((c) => c.category);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

