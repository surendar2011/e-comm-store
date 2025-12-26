"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          cache: "no-store",
        });
        const cart = await response.json();
        setItemCount(cart.itemCount || 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
    
    // Refresh cart count periodically
    const interval = setInterval(fetchCart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 text-white hover:text-cyan-300 transition-colors group"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
      {!isLoading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-md">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

