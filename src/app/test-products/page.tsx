import { prisma } from "@/lib/prisma";

export default async function TestProductsPage() {
  let productCount = 0;
  let products: any[] = [];
  let error: string | null = null;

  try {
    productCount = await prisma.product.count();
    products = await prisma.product.findMany({
      take: 5,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Test Page</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium">Database Error:</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <p className="text-lg">
                <strong>Total Products in Database:</strong> {productCount}
              </p>
            </div>

            {products.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Sample Products:</h2>
                <ul className="space-y-2">
                  {products.map((product) => (
                    <li key={product.id} className="border-b pb-2">
                      <p><strong>Name:</strong> {product.name}</p>
                      <p><strong>Price:</strong> ${Number(product.price)}</p>
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Active:</strong> {product.isActive ? "Yes" : "No"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">No products found in database.</p>
                <p className="text-yellow-600 text-sm mt-2">
                  Run: <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma db seed</code>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

