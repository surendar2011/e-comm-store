import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Admin - New Product",
  description: "Create a new product",
};

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Product</h1>
        <p className="mt-2 text-gray-600">Add a new product to your catalog</p>
      </div>

      <ProductForm />
    </div>
  );
}

