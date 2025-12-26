import { getAdminOrderById } from "@/app/actions/admin";
import { notFound } from "next/navigation";
import AdminOrderDetail from "@/components/admin/AdminOrderDetail";

export const metadata = {
  title: "Admin - Order Details",
  description: "View order details",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAdminOrderById(id);

  if (!result.success || !result.order) {
    notFound();
  }

  return (
    <div className="p-8">
      <AdminOrderDetail order={result.order} />
    </div>
  );
}

