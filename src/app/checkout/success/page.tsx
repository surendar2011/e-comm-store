import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { cookies } from "next/headers";

export const metadata = {
  title: "Order Successful",
  description: "Your order has been placed successfully",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session) {
    redirect("/auth/login");
  }

  // Clear cart after successful payment
  try {
    const cookieStore = await cookies();
    cookieStore.set("cart", JSON.stringify({ items: [], total: 0, itemCount: 0 }), {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and you will
            receive an email confirmation shortly.
          </p>
          {params.session_id && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: {params.session_id}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              View Orders
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-md hover:bg-gray-300 font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

