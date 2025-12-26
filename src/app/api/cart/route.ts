import { NextRequest, NextResponse } from "next/server";
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

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

// GET - Get cart
export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE_NAME);
    
    if (!cartCookie?.value) {
      return NextResponse.json({ items: [], total: 0, itemCount: 0 });
    }

    try {
      const cart = JSON.parse(cartCookie.value);
      return NextResponse.json(cart);
    } catch {
      return NextResponse.json({ items: [], total: 0, itemCount: 0 });
    }
  } catch (error) {
    console.error("Error reading cart:", error);
    return NextResponse.json({ items: [], total: 0, itemCount: 0 });
  }
}

// POST - Add to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock available" },
        { status: 400 }
      );
    }

    // Get current cart
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE_NAME);
    let cart: Cart = { items: [], total: 0, itemCount: 0 };

    if (cartCookie?.value) {
      try {
        cart = JSON.parse(cartCookie.value);
      } catch {
        cart = { items: [], total: 0, itemCount: 0 };
      }
    }

    // Update cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          { success: false, error: "Cannot add more items. Stock limit reached." },
          { status: 400 }
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
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

    // Save cart
    const response = NextResponse.json({ success: true, cart });
    response.cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      maxAge: CART_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// PUT - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item
      return DELETE(request);
    }

    // Verify product exists and check stock
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock available" },
        { status: 400 }
      );
    }

    // Get current cart
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE_NAME);
    let cart: Cart = { items: [], total: 0, itemCount: 0 };

    if (cartCookie?.value) {
      try {
        cart = JSON.parse(cartCookie.value);
      } catch {
        cart = { items: [], total: 0, itemCount: 0 };
      }
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;

    const { total, itemCount } = calculateCartTotals(cart.items);
    cart.total = total;
    cart.itemCount = itemCount;

    // Save cart
    const response = NextResponse.json({ success: true, cart });
    response.cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      maxAge: CART_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove from cart
export async function DELETE(request: NextRequest) {
  try {
    const { productId } = await request.json();

    // Get current cart
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE_NAME);
    let cart: Cart = { items: [], total: 0, itemCount: 0 };

    if (cartCookie?.value) {
      try {
        cart = JSON.parse(cartCookie.value);
      } catch {
        cart = { items: [], total: 0, itemCount: 0 };
      }
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    const { total, itemCount } = calculateCartTotals(cart.items);
    cart.total = total;
    cart.itemCount = itemCount;

    // Save cart
    const response = NextResponse.json({ success: true, cart });
    response.cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      maxAge: CART_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

