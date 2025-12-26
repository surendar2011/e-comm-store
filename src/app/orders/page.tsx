import { getUserOrders } from "@/app/actions/orders";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import OrderCard from "@/components/orders/OrderCard";
import { Package } from "lucide-react";

export const metadata = {
  title: "My Orders",
  description: "View your order history",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?callbackUrl=/orders");
  }

  const result = await getUserOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium">Error loading orders</p>
            <p className="text-red-600 text-sm mt-1">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const orders = result.orders || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">
            View and track all your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-gray-100 p-4">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here!
            </p>
            <a
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

