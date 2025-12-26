"use client";

import { useRouter } from "next/navigation";
import CartItem from "./CartItem";

interface CartClientProps {
  items: Array<{
    productId: string;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
  }>;
}

export default function CartClient({ items }: CartClientProps) {
  const router = useRouter();

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.productId}
          productId={item.productId}
          name={item.name}
          image={item.image}
          price={item.price}
          quantity={item.quantity}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}

