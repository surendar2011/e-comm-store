"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  price: number;
}

export default function AddToCartButton({
  productId,
  stock,
  price,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setError(null);
    setSuccess(false);

    if (quantity <= 0 || quantity > stock) {
      setError(`Please enter a quantity between 1 and ${stock}`);
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
        router.refresh(); // Refresh to update cart count
      } else {
        setError(result.error || "Failed to add to cart");
      }
    } catch (error) {
      setError("Failed to add to cart");
    } finally {
      setIsPending(false);
    }
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white py-3 px-6 rounded-md cursor-not-allowed text-lg font-medium flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(stock, Number(e.target.value) || 1)))}
          min="1"
          max={stock}
          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          disabled={isPending}
        />
      </div>
      <button
        onClick={handleAddToCart}
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        {isPending ? "Adding..." : success ? "Added to Cart!" : "Add to Cart"}
      </button>
      {error && (
        <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
          Item added to cart! View cart to continue.
        </p>
      )}
    </div>
  );
}

