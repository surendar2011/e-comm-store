"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  stock,
}: ProductCardProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMessage(null);
    
    if (stock === 0) {
      setMessage({ type: "error", text: "Out of stock" });
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: "success", text: "Added to cart!" });
        setTimeout(() => {
          setMessage(null);
        }, 2000);
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to add to cart" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add to cart" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link href={`/products/${id}`} className="flex-1 flex flex-col">
        <div className="relative w-full h-64 bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {category}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className={`text-sm ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={stock === 0 || isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <ShoppingCart className="w-4 h-4" />
          {isPending ? "Adding..." : stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
        {message && (
          <p className={`text-xs mt-2 text-center ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

