import { getProductById } from "@/app/actions/admin";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Admin - Edit Product",
  description: "Edit product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductById(id);

  if (!result.success || !result.product) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-600">Update product information</p>
      </div>

      <ProductForm product={result.product} />
    </div>
  );
}

