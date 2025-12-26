import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Home } from "lucide-react";
import { auth, signOut } from "@/auth";

export default async function AdminNav() {
  const session = await auth();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/admin"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center gap-2"
            >
              <LayoutDashboard className="w-6 h-6" />
              Admin
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Orders
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Store
            </Link>
            <span className="text-gray-700">
              {session?.user?.name || session?.user?.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

