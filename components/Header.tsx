"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import AuthButton from "@/components/AuthButton";
import { useCart } from "@/context/CartContext";

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
  const { cartCount } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = search.trim();
    if (!query) return;

    window.location.href = `/products?search=${encodeURIComponent(query)}`;
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#24451f] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        <span className="mr-2">🚚</span>
        Fresh from farms, delivered to your family
        <span className="mx-2 hidden text-white/50 sm:inline">|</span>
        <span className="hidden sm:inline">
          Natural goodness in every bite
        </span>
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        {/* Main header */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-5 lg:px-6">
          {/* Mobile menu */}
          <button
            type="button"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-[#24451f] transition hover:bg-[#f4f7ef] md:hidden"
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            aria-label="Farmer2Family home"
            className="flex shrink-0 items-center gap-1 text-xl font-black tracking-tight text-[#28551f] sm:text-2xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4e8]">
              <Leaf size={22} className="text-[#28551f]" />
            </span>
            <span>
              Farmer<span className="text-[#d7862c]">2</span>Family
            </span>
          </Link>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden min-w-0 max-w-xl flex-1 md:block"
          >
            <div className="flex items-center rounded-full border border-gray-200 bg-[#f8f9f5] px-4 transition focus-within:border-[#6b8d55] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28551f]/10">
              <Search size={20} className="mr-3 shrink-0 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vegetables, fruits, rice..."
                aria-label="Search products"
                className="h-12 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="rounded-full bg-[#28551f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1e4018]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Header actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-[#f4f7ef] hover:text-[#28551f] sm:flex"
            >
              <Heart size={21} />
            </Link>

            <div className="hidden sm:block">
              <AuthButton />
            </div>

            <Link
              href="/checkout"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#28551f] transition hover:bg-[#f4f7ef]"
            >
              <ShoppingCart size={22} />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d7862c] px-1 text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop category navigation */}
        <nav
          aria-label="Product categories"
          className="hidden border-t border-gray-100 md:block"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-6">
            <Link
              href="/products"
              className="flex shrink-0 items-center gap-1 py-3 text-sm font-semibold text-[#28551f] hover:text-[#d7862c]"
            >
              Shop All
              <ChevronDown size={14} />
            </Link>

            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="shrink-0 border-b-2 border-transparent py-3 text-sm font-medium text-gray-600 transition hover:border-[#d7862c] hover:text-[#28551f]"
              >
                {category}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile navigation */}
        {mobileMenu && (
          <div className="border-t border-gray-100 bg-white px-4 py-5 shadow-lg md:hidden">
            {/* Mobile search */}
            <form onSubmit={handleSearch} role="search" className="mb-5">
              <div className="flex items-center rounded-xl border border-gray-200 bg-[#f8f9f5] px-3 focus-within:border-[#6b8d55]">
                <Search size={19} className="mr-3 shrink-0 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="text-[#28551f]"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <Link
              href="/products"
              onClick={() => setMobileMenu(false)}
              className="mb-3 block rounded-lg bg-[#f1f5eb] px-4 py-3 font-semibold text-[#28551f]"
            >
              Shop All Products
            </Link>

            <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              Browse Categories
            </p>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg border border-gray-100 px-3 py-3 text-sm font-medium text-gray-700 transition hover:border-[#d9e5cf] hover:bg-[#f7f9f3] hover:text-[#28551f]"
                >
                  {category}
                </Link>
              ))}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="mb-4 sm:hidden">
                <AuthButton />
              </div>

              <Link
                href="/wishlist"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
              >
                <Heart size={19} />
                My Wishlist
              </Link>

              <Link
                href="/checkout"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2 text-sm font-medium text-gray-700"
              >
                <ShoppingCart size={19} />
                My Cart
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
