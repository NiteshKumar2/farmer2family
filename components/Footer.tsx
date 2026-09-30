import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#172b14] px-4 py-14 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

        <div>
          <h2 className="text-2xl font-black">
            Farmer
            <span className="text-[#d7862c]">2</span>
            Family
          </h2>

          <p className="mt-4 max-w-xs text-sm leading-7 text-gray-300">
            Fresh products from trusted farmers to your family.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Shop</h3>

          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <Link href="/products" className="block">
              All Products
            </Link>

            <Link href="/categories" className="block">
              Categories
            </Link>

            <Link href="/cart" className="block">
              Cart
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Farmer2Family</h3>

          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <Link href="/about" className="block">
              About Us
            </Link>

            <Link href="/farmers" className="block">
              Our Farmers
            </Link>

            <Link href="/contact" className="block">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Customer</h3>

          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <Link href="/login" className="block">
              Login
            </Link>

            <Link href="/account" className="block">
              My Account
            </Link>

            <Link href="/register" className="block">
              Visitor Registration
            </Link>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Farmer2Family. All rights reserved.
      </div>

    </footer>
  );
}