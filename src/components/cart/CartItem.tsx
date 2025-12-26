"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  productId: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  onUpdate: () => void;
}

export default function CartItem({
  productId,
  name,
  image,
  price,
  quantity,
  onUpdate,
}: CartItemProps) {
  const [isPending, setIsPending] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLocalQuantity(newQuantity);
    setIsPending(true);
    
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      
      const result = await response.json();
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleRemove = async () => {
    setIsPending(true);
    
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      
      const result = await response.json();
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <Link href={`/products/${productId}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${productId}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
        >
          {name}
        </Link>
        <p className="text-gray-600 mt-1">${price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={isPending || localQuantity <= 1}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="px-4 py-1 text-gray-900 min-w-[3rem] text-center">
            {localQuantity}
          </span>
          <button
            onClick={() => handleQuantityChange(localQuantity + 1)}
            disabled={isPending}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>

        <div className="text-right min-w-[6rem]">
          <p className="text-lg font-bold text-gray-900">
            ${(price * localQuantity).toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors disabled:opacity-50"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

