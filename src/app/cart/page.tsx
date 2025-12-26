import CartClient from "@/components/cart/CartClient";
import EmptyCart from "@/components/cart/EmptyCart";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata = {
  title: "Shopping Cart",
  description: "Review your cart items",
};

async function getCart() {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("cart");
    
    if (!cartCookie?.value) {
      return { items: [], total: 0, itemCount: 0 };
    }

    return JSON.parse(cartCookie.value);
  } catch (error) {
    console.error("Error reading cart:", error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <CartClient items={cart.items} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cart.itemCount})</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-md hover:bg-blue-700 font-medium mb-4"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="block w-full text-center text-gray-700 hover:text-blue-600 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

