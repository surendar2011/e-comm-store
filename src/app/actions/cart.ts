"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string | null;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_COOKIE_NAME = "cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getCartFromCookie(): Cart {
  try {
    const cookieStore = cookies();
    
    // In Next.js 16, cookies() returns ReadonlyRequestCookies
    // Check if it's the expected type and has get method
    if (!cookieStore) {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    // Try to get the cookie - handle both direct access and method call
    let cartValue: string | undefined;
    
    try {
      // Standard Next.js cookies API
      if ("get" in cookieStore && typeof (cookieStore as any).get === "function") {
        const cartCookie = (cookieStore as any).get(CART_COOKIE_NAME);
        cartValue = cartCookie?.value;
      }
    } catch (getError) {
      // If get method fails, try alternative access
      console.warn("Cookie get method failed, trying alternative:", getError);
    }
    
    if (!cartValue) {
      return { items: [], total: 0, itemCount: 0 };
    }

    try {
      return JSON.parse(cartValue);
    } catch {
      return { items: [], total: 0, itemCount: 0 };
    }
  } catch (error) {
    console.error("Error reading cart cookie:", error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

function saveCartToCookie(cart: Cart) {
  try {
    const cookieStore = cookies();
    
    if (!cookieStore) {
      console.warn("Cookies API not available");
      return;
    }
    
    // Try to set the cookie - handle both direct access and method call
    try {
      // Standard Next.js cookies API
      if ("set" in cookieStore && typeof (cookieStore as any).set === "function") {
        (cookieStore as any).set(CART_COOKIE_NAME, JSON.stringify(cart), {
          maxAge: CART_COOKIE_MAX_AGE,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        console.warn("Cookie set method not available");
      }
    } catch (setError) {
      console.error("Error setting cookie:", setError);
    }
  } catch (error) {
    console.error("Error saving cart cookie:", error);
  }
}

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

export async function getCart(): Promise<Cart> {
  const cart = getCartFromCookie();
  return cart;
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.stock < quantity) {
      return { success: false, error: "Insufficient stock available" };
    }

    const cart = getCartFromCookie();
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return { success: false, error: "Cannot add more items. Stock limit reached." };
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product.id,
        quantity,
        price: Number(product.price),
        name: product.name,
        image: product.image,
      });
    }

    const { total, itemCount } = calculateCartTotals(cart.items);
    cart.total = total;
    cart.itemCount = itemCount;

    saveCartToCookie(cart);

    return { success: true, cart };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function updateCartItem(productId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    // Verify product exists and check stock
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.stock < quantity) {
      return { success: false, error: "Insufficient stock available" };
    }

    const cart = getCartFromCookie();
    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      return { success: false, error: "Item not found in cart" };
    }

    cart.items[itemIndex].quantity = quantity;

    const { total, itemCount } = calculateCartTotals(cart.items);
    cart.total = total;
    cart.itemCount = itemCount;

    saveCartToCookie(cart);

    return { success: true, cart };
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, error: "Failed to update cart" };
  }
}

export async function removeFromCart(productId: string) {
  try {
    const cart = getCartFromCookie();
    cart.items = cart.items.filter((item) => item.productId !== productId);

    const { total, itemCount } = calculateCartTotals(cart.items);
    cart.total = total;
    cart.itemCount = itemCount;

    saveCartToCookie(cart);

    return { success: true, cart };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

export async function clearCart() {
  try {
    const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };
    saveCartToCookie(emptyCart);
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

