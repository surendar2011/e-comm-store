import { getAdminOrders } from "@/app/actions/admin";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const metadata = {
  title: "Admin - Orders",
  description: "Manage orders",
};

export default async function AdminOrdersPage() {
  const result = await getAdminOrders();

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-medium">Error loading orders</p>
          <p className="text-red-600 text-sm mt-1">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-gray-600">Manage and track customer orders</p>
      </div>

      <AdminOrdersClient initialOrders={result.orders} />
    </div>
  );
}

