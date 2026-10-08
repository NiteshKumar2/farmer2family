"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthButton from "@/components/AuthButton";

const categories = [
  "Vegetables",
  "Fruits",
  "Rice & Grains",
  "Pulses",
  "Dairy",
  "Oils",
  "Spices",
  "Organic Foods",
];

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <div className="bg-[#24451f] px-4 py-2 text-center text-sm text-white">
        🚚 Fresh products from farmers to your family
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>

          <Link
            href="/"
            className="whitespace-nowrap text-2xl font-black tracking-tight text-[#28551f]"
          >
            Farmer
            <span className="text-[#d7862c]">2</span>
            Family
          </Link>

          <div className="hidden flex-1 md:block">
            <div className="flex items-center rounded-full border border-gray-200 bg-[#f7f8f3] px-5 py-3">
              <Search size={20} className="mr-3 text-gray-500" />

              <input
                type="search"
                placeholder="Search vegetables, rice, dal, oil..."
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block">
              <Heart size={21} />
            </button>
            <AuthButton />

            <Link href="/cart" className="relative">
              <ShoppingCart size={22} />

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d7862c] text-xs text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        <nav className="hidden border-t md:block">
          <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-4 py-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-[#28551f]"
              >
                {category}
              </Link>
            ))}
          </div>
        </nav>

        {mobileMenu && (
          <div className="border-t bg-white px-5 py-5 md:hidden">
            <div className="mb-5 flex items-center rounded-lg border px-4 py-3">
              <Search size={18} className="mr-3 text-gray-500" />

              <input
                placeholder="Search products..."
                className="w-full outline-none"
              />
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="block font-medium"
                  onClick={() => setMobileMenu(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
