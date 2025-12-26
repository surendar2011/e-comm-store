import { getOrderById } from "@/app/actions/orders";
import { notFound } from "next/navigation";
import OrderDetail from "@/components/orders/OrderDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.order) {
    return {
      title: "Order Not Found",
    };
  }

  return {
    title: `Order #${result.order.id.slice(0, 8).toUpperCase()}`,
    description: `View details for order #${result.order.id.slice(0, 8).toUpperCase()}`,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OrderDetail order={result.order} />
      </div>
    </div>
  );
}

