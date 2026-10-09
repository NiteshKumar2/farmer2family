"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, cartCount, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-[#fafaf7] p-6 text-[#26351f]">
      <h1 className="text-3xl font-bold">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <p>Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-full bg-[#28551f] px-6 py-3 text-white"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-4"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
              </div>
              <p>
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <p className="mt-6">Total items: {cartCount}</p>
          <p className="mt-2 text-xl font-bold">
            Subtotal: ₹{subtotal.toFixed(2)}
          </p>

          <Link
            href="/checkout"
            className="mt-6 inline-block rounded-full bg-[#28551f] px-6 py-3 text-white"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </main>
  );
}