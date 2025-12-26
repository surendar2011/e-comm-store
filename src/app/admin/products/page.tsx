import { getAdminProducts } from "@/app/actions/admin";
import AdminProductsClient from "@/components/admin/AdminProductsClient";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Admin - Products",
  description: "Manage products",
};

export default async function AdminProductsPage() {
  const result = await getAdminProducts();

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-medium">Error loading products</p>
          <p className="text-red-600 text-sm mt-1">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <AdminProductsClient initialProducts={result.products} />
    </div>
  );
}

