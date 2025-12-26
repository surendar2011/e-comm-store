"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().or(z.number()).transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("Price must be a positive number");
    }
    return num;
  }),
  category: z.string().min(1, "Category is required"),
  stock: z.string().or(z.number()).transform((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(num) || num < 0) {
      throw new Error("Stock must be a non-negative number");
    }
    return num;
  }),
  image: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session.user.id;
}

// Products
export async function getAdminProducts() {
  try {
    await checkAdmin();

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          select: { quantity: true },
        },
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, products: [], error: "Failed to fetch products" };
  }
}

export async function createProduct(formData: FormData) {
  try {
    await checkAdmin();

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      stock: formData.get("stock") as string,
      image: formData.get("image") as string,
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    };

    const validatedData = productSchema.parse(rawData);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        price: validatedData.price,
        category: validatedData.category,
        stock: validatedData.stock,
        image: validatedData.image || null,
        isActive: validatedData.isActive ?? true,
      },
    });

    return { success: true, product };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    await checkAdmin();

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      stock: formData.get("stock") as string,
      image: formData.get("image") as string,
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    };

    const validatedData = productSchema.parse(rawData);

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        price: validatedData.price,
        category: validatedData.category,
        stock: validatedData.stock,
        image: validatedData.image || null,
        isActive: validatedData.isActive ?? true,
      },
    });

    return { success: true, product };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await checkAdmin();

    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getProductById(productId: string) {
  try {
    await checkAdmin();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, product: null, error: "Product not found" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, product: null, error: "Failed to fetch product" };
  }
}

// Orders
export async function getAdminOrders() {
  try {
    await checkAdmin();

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, orders: [], error: "Failed to fetch orders" };
  }
}

export async function getAdminOrderById(orderId: string) {
  try {
    await checkAdmin();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, order: null, error: "Order not found" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, order: null, error: "Failed to fetch order" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await checkAdmin();

    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return { success: true, order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

// Dashboard Stats
export async function getAdminStats() {
  try {
    await checkAdmin();

    const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      stats: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        totalProducts,
        totalUsers,
        recentOrders,
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

