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
  PackageSearch,
  ArrowRight,
  Sprout,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [categoryMenu, setCategoryMenu] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    setMobileMenu(false);
    window.location.href = `/products?search=${encodeURIComponent(query)}`;
  }

  function closeMobileMenu() {
    setMobileMenu(false);
    setCategoryMenu(false);
  }

  // Close the mobile menu with Escape.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent the mobile drawer from staying open after navigation.
  useEffect(() => {
    if (mobileMenu) {
      mobileMenuRef.current?.focus();
    }
  }, [mobileMenu]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#24451f] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-2 text-center text-[11px] font-medium tracking-wide sm:px-6 sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Sprout size={14} aria-hidden="true" />
            Fresh from farms, delivered to your family
          </span>

          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-white/30 sm:block"
          />

          <span className="hidden text-white/80 sm:inline">
            Natural goodness in every bite
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#e8eddf] bg-white/95 shadow-[0_3px_16px_rgba(36,69,31,0.05)] backdrop-blur-md">
        {/* Main header */}
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:gap-5 sm:px-6 lg:px-8 lg:py-4">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenu}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenu((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5ebde] text-[#28551f] transition hover:bg-[#f3f7ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28551f] md:hidden"
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Brand logo */}
          <Link
            href="/"
            aria-label="Farmer2Family home"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-2"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4e6] transition group-hover:bg-[#e1ecd5] sm:h-11 sm:w-11">
              <Leaf
                size={25}
                strokeWidth={2.1}
                className="text-[#28551f] transition group-hover:rotate-[-8deg]"
              />
            </span>

            <span className="text-[17px] font-black tracking-tight text-[#28551f] sm:text-xl lg:text-2xl">
              Farmer
              <span className="text-[#d7862c]">2</span>
              Family
              <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-gray-500 sm:block">
                Farm fresh living
              </span>
            </span>
          </Link>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block"
          >
            <div className="flex items-center rounded-full border border-[#e3e9dc] bg-[#f7f9f3] p-1.5 transition focus-within:border-[#8ca87b] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#28551f]/5">
              <Search
                size={19}
                aria-hidden="true"
                className="ml-3 shrink-0 text-[#72816b]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search fresh vegetables, fruits..."
                aria-label="Search products"
                className="h-9 min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#28551f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7862c] focus-visible:ring-offset-2"
              >
                Search
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* Header actions */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Track order */}
            <Link
              href="/track-order"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#28551f] transition hover:bg-[#f2f6ed] lg:inline-flex"
            >
              <PackageSearch size={19} aria-hidden="true" />
              Track Order
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="My wishlist"
              title="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-[#f2f6ed] hover:text-[#28551f] sm:flex"
            >
              <Heart size={21} strokeWidth={1.8} />
            </Link>

            {/* Authentication */}
            <div className="hidden sm:block">
              <AuthButton />
            </div>

            {/* Shopping cart */}
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${cartCount} ${
                cartCount === 1 ? "item" : "items"
              }`}
              title="Shopping cart"
              className="group relative flex h-10 w-10 items-center justify-center rounded-full text-[#28551f] transition hover:bg-[#f2f6ed] sm:h-11 sm:w-11"
            >
              <ShoppingCart
                size={22}
                strokeWidth={1.8}
                className="transition group-hover:scale-105"
              />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4.75 min-w-4.75 items-center justify-center rounded-full border-2 border-white bg-[#d7862c] px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop category navigation */}
        <nav
          aria-label="Main product navigation"
          className="hidden border-t border-[#eef1e9] md:block"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 lg:gap-8 lg:px-8">
            <div className="group relative shrink-0">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 border-b-2 border-transparent py-3.5 text-sm font-bold text-[#28551f] transition hover:border-[#d7862c]"
              >
                Shop All
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className="transition group-hover:rotate-180"
                />
              </Link>

              <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-2 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-[#f3f7ed] hover:text-[#28551f]"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="shrink-0 border-b-2 border-transparent py-3.5 text-sm font-medium text-gray-600 transition hover:border-[#d7862c] hover:text-[#28551f]"
              >
                {category}
              </Link>
            ))}

            <Link
              href="/track-order"
              className="ml-auto inline-flex shrink-0 items-center gap-2 py-3.5 text-sm font-semibold text-[#28551f] transition hover:text-[#d7862c] lg:hidden"
            >
              <PackageSearch size={17} aria-hidden="true" />
              Track Order
            </Link>
          </div>
        </nav>

        {/* Mobile navigation drawer */}
        {mobileMenu && (
          <div
            id="mobile-navigation"
            ref={mobileMenuRef}
            tabIndex={-1}
            className="max-h-[calc(100dvh-90px)] overflow-y-auto border-t border-[#e8eddf] bg-white px-4 py-5 shadow-lg outline-none md:hidden"
          >
            {/* Mobile search */}
            <form onSubmit={handleSearch} role="search" className="mb-5">
              <div className="flex items-center rounded-xl border border-[#e3e9dc] bg-[#f7f9f3] px-3 focus-within:border-[#8ca87b] focus-within:ring-2 focus-within:ring-[#28551f]/10">
                <Search
                  size={19}
                  aria-hidden="true"
                  className="mr-2 shrink-0 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="h-11 w-full min-w-0 bg-transparent text-sm outline-none"
                />

                <button
                  type="submit"
                  aria-label="Submit product search"
                  className="rounded-lg p-2 text-[#28551f] transition hover:bg-[#eaf1e2]"
                >
                  <ArrowRight size={19} aria-hidden="true" />
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl bg-[#28551f] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1e4018]"
              >
                Shop All
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <Link
                href="/track-order"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl border border-[#dfe8d6] bg-[#f4f7ef] px-4 py-3.5 text-sm font-semibold text-[#28551f] transition hover:bg-[#eaf1e2]"
              >
                Track Order
                <PackageSearch size={17} aria-hidden="true" />
              </Link>
            </div>

            {/* Categories */}
            <div className="mb-3 flex items-center justify-between">
              <p className="px-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                Browse Categories
              </p>

              <button
                type="button"
                onClick={() => setCategoryMenu((open) => !open)}
                aria-expanded={categoryMenu}
                aria-label={
                  categoryMenu ? "Collapse categories" : "Expand categories"
                }
                className="rounded-lg p-1.5 text-[#28551f] hover:bg-[#f2f6ed]"
              >
                <ChevronDown
                  size={19}
                  className={`transition-transform ${
                    categoryMenu ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {categoryMenu && (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/products?category=${encodeURIComponent(category)}`}
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-gray-100 px-3 py-3 text-sm font-medium text-gray-700 transition hover:border-[#d9e5cf] hover:bg-[#f7f9f3] hover:text-[#28551f]"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* Account and secondary links */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="mb-4">
                <AuthButton />
              </div>

              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#f7f9f3] hover:text-[#28551f]"
              >
                <Heart size={19} aria-hidden="true" />
                My Wishlist
              </Link>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#f7f9f3] hover:text-[#28551f]"
              >
                <ShoppingCart size={19} aria-hidden="true" />
                My Cart
                {cartCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#d7862c] px-2 py-0.5 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}