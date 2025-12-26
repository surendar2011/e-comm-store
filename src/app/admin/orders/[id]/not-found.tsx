import Link from "next/link";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <PackageX className="h-16 w-16 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-8">
          The order you're looking for doesn't exist.
        </p>
        <Link
          href="/admin/orders"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}

