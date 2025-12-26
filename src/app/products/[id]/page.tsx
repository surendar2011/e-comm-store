import { getProductById } from "@/app/actions/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/AddToCartButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProductById(id);
  if (!result.success || !result.product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: result.product.name,
    description: result.product.description || undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductById(id);

  if (!result.success || !result.product) {
    notFound();
  }

  const product = result.product;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-gray-600 mb-6">{product.description}</p>
              )}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
              <div className="mb-6">
                <p
                  className={`text-lg ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock} available)`
                    : "Out of Stock"}
                </p>
              </div>
              <div className="mt-auto">
                <AddToCartButton
                  productId={product.id}
                  stock={product.stock}
                  price={Number(product.price)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

