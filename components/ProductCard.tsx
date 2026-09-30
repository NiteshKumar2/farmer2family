"use client";

import { ShoppingCart, Heart } from "lucide-react";

type Product = {
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="relative flex aspect-square items-center justify-center bg-[#f3f5ec]">

        <button className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm">
          <Heart size={18} />
        </button>

        <span className="text-7xl">
          {product.image}
        </span>
      </div>

      <div className="p-4">

        <p className="text-xs font-medium text-gray-500">
          {product.category}
        </p>

        <h3 className="mt-1 min-h-12 font-bold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-3 flex items-end justify-between">

          <div>
            <p className="text-lg font-black">
              ₹{product.price}
            </p>

            <p className="text-xs text-gray-500">
              {product.unit}
            </p>
          </div>

          <button className="flex items-center gap-1 rounded-full bg-[#28551f] px-4 py-2 text-sm font-bold text-white hover:bg-[#1c3e17]">
            <ShoppingCart size={16} />
            Add
          </button>

        </div>
      </div>
    </div>
  );
}