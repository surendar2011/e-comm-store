import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase",
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

export default async function CheckoutPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  // Verify all products are still available and get current prices
  const productIds = cart.items.map((item: any) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  // Validate cart items
  const validItems = cart.items.filter((item: any) => {
    const product = products.find((p) => p.id === item.productId);
    return product && product.stock >= item.quantity;
  });

  if (validItems.length === 0) {
    redirect("/cart");
  }

  // Calculate totals with current prices
  const itemsWithPrices = validItems.map((item: any) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      ...item,
      price: Number(product.price),
      name: product.name,
      image: product.image,
    };
  });

  const subtotal = itemsWithPrices.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutClient
              items={itemsWithPrices}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemsWithPrices.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

