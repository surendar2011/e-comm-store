import Link from "next/link";
import Image from "next/image";
import { Calendar, Package, DollarSign } from "lucide-react";

interface OrderCardProps {
  order: {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
    orderItems: Array<{
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        image: string | null;
        category: string;
      };
    }>;
  };
}

function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const firstItem = order.orderItems[0];

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Order Info */}
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          {/* Product Image */}
          {firstItem && (
            <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {firstItem.product.image ? (
                <Image
                  src={firstItem.product.image}
                  alt={firstItem.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
          )}

          {/* Order Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* Product Names */}
            <div className="text-sm text-gray-600">
              {order.orderItems.length === 1 ? (
                <p>{firstItem.product.name}</p>
              ) : (
                <p>
                  {firstItem.product.name}
                  {order.orderItems.length > 1 && (
                    <span className="text-gray-500">
                      {" "}
                      + {order.orderItems.length - 1} more
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <DollarSign className="w-5 h-5" />
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}

