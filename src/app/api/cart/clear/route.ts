import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CART_COOKIE_NAME = "cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// POST - Clear cart
export async function POST() {
  try {
    const emptyCart = { items: [], total: 0, itemCount: 0 };
    const response = NextResponse.json({ success: true });
    
    const cookieStore = await cookies();
    cookieStore.set(CART_COOKIE_NAME, JSON.stringify(emptyCart), {
      maxAge: CART_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}

