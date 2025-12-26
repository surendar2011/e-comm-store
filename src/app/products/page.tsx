import { getProducts, getCategories } from "@/app/actions/products";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";

export const metadata = {
  title: "Products",
  description: "Browse our collection of products",
};

// Force dynamic rendering to ensure searchParams are processed
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  
  let categories: string[] = [];
  let result: any = { success: false, products: [] };
  
  try {
    categories = await getCategories();
    result = await getProducts({
      search: params.search,
      category: params.category,
      sortBy: (params.sortBy as any) || "createdAt",
      sortOrder: (params.sortOrder as any) || "desc",
    });
    
    console.log("Fetching products with:", {
      search: params.search,
      category: params.category,
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
      count: result.products?.length || 0,
    });
  } catch (error) {
    console.error("Error in ProductsPage:", error);
  }

  const products = result.products || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        <ProductFilters categories={categories} />

        {!result.success && result.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-800 font-medium">Error loading products</p>
            <p className="text-red-600 text-sm mt-1">{result.error}</p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No products found.</p>
            <p className="text-gray-500 mt-2">
              {result.success 
                ? "Try adjusting your search or filters."
                : "Please check the database connection and try again."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {products.length} product{products.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={Number(product.price)}
                  image={product.image}
                  category={product.category}
                  stock={product.stock}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

