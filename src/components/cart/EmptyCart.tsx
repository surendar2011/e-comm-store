"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <ShoppingCart 
            className="h-32 w-32 text-gray-300" 
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 flex items-center justify-center top-8">
            <div className="w-24 h-1 bg-gray-400 rotate-[30deg] rounded-full"></div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started!</p>
      <Link
        href="/products"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

