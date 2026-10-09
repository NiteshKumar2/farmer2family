"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [message, setMessage] = useState("");

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Your checkout form is ready. Connect your order API to place and save orders."
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#fafaf7] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <ShoppingBag
            size={42}
            className="mx-auto text-[#28551f]"
          />
          <h1 className="mt-5 text-2xl font-black text-[#26351f]">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add some fresh products before proceeding to checkout.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#28551f] px-5 py-3 font-bold text-white hover:bg-[#1e4018]"
          >
            Shop products <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#26351f]">
      {/* Checkout header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black tracking-tight text-[#28551f] sm:text-2xl"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4e8]">
              <Leaf size={23} />
            </span>
            Farmer<span className="-ml-2 text-[#d7862c]">2</span>Family
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 sm:text-sm">
            <LockKeyhole size={17} className="text-[#28551f]" />
            Secure checkout
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_420px]">
        {/* Checkout form */}
        <section className="px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#28551f]"
          >
            <ArrowLeft size={16} />
            Return to cart
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-[#28551f]">Cart</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-[#26351f]">Information</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">Payment</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-9">
            {/* Contact */}
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className="text-xl font-extrabold sm:text-2xl">
                  Contact information
                </h1>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#28551f] hover:underline"
                >
                  Log in
                </Link>
              </div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
              />

              <label className="mt-4 flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#28551f]"
                />
                Email me with updates and offers.
              </label>
            </section>

            {/* Delivery address */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <MapPin size={22} className="text-[#28551f]" />
                <h2 className="text-xl font-extrabold">
                  Delivery address
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                  Mobile number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                  placeholder="10-digit mobile number"
                  title="Enter a valid 10-digit Indian mobile number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                  House number, street and address
                </label>
                <input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  required
                  placeholder="House number and street name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="landmark" className="mb-2 block text-sm font-medium">
                  Apartment, landmark or area (optional)
                </label>
                <input
                  id="landmark"
                  name="landmark"
                  placeholder="Apartment, landmark or locality"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-medium">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    autoComplete="address-level1"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    <option>Haryana</option>
                    <option>Delhi</option>
                    <option>Punjab</option>
                    <option>Uttar Pradesh</option>
                    <option>Rajasthan</option>
                    <option>Himachal Pradesh</option>
                    <option>Uttarakhand</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="pincode" className="mb-2 block text-sm font-medium">
                  PIN code
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="postal-code"
                  required
                  placeholder="6-digit PIN code"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                  Delivery instructions (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Any directions for our delivery team?"
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />
              </div>
            </section>

            {/* Delivery method */}
            <section>
              <h2 className="text-xl font-extrabold">
                Delivery method
              </h2>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#28551f] bg-[#f5f8f1] p-4">
                <Truck size={22} className="mt-0.5 text-[#28551f]" />
                <div>
                  <p className="font-bold">Home delivery</p>
                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Delivery availability and charges will be confirmed for
                    your address.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section>
              <h2 className="text-xl font-extrabold">
                Payment method
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Choose how you would prefer to pay.
              </p>

              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <label className="flex cursor-pointer items-center gap-3 border-b border-gray-200 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="h-4 w-4 accent-[#28551f]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">Cash on delivery</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Pay when your order arrives, if available.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="h-4 w-4 accent-[#28551f]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">Pay online</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Online payment will be available after payment gateway
                      integration.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {message && (
              <div
                role="status"
                className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28551f] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#1e4018]"
            >
              Continue with{" "}
              {paymentMethod === "cod" ? "cash on delivery" : "online payment"}
              <ArrowRight size={18} />
            </button>

            <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-400">
              <LockKeyhole size={14} />
              Your information should be handled securely.
            </p>
          </form>

          <div className="mt-8 border-t border-gray-100 pt-5">
            <Link
              href="/products"
              className="text-sm font-medium text-[#28551f] hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </section>

        {/* Order summary */}
        <aside className="border-t border-gray-200 bg-[#fafbf8] px-4 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-12">
          <div className="lg:sticky lg:top-8">
            <h2 className="text-xl font-extrabold">
              Order summary
            </h2>

            <div className="mt-6 space-y-5">
              {items.map((item) => {
                const isPhoto =
                  !!item.image &&
                  (item.image.startsWith("/") ||
                    item.image.startsWith("data:image/") ||
                    /^https?:\/\//i.test(item.image));

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-4"
                  >
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white">
                      {isPhoto ? (
                        <img
                          src={item.image!}
                          alt={item.name}
                          className="h-full w-full rounded-xl object-contain p-1"
                        />
                      ) : (
                        <span className="text-3xl">
                          {item.image || "🌱"}
                        </span>
                      )}
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-500 px-1 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border-t border-gray-200 pt-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  aria-label="Discount code"
                  disabled
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm opacity-70"
                />
                <button
                  type="button"
                  disabled
                  className="rounded-xl bg-gray-200 px-4 text-sm font-bold text-gray-500"
                >
                  Apply
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Discount codes are not enabled yet.
              </p>
            </div>

            <div className="mt-7 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Shipping</span>
                <span className="text-right text-xs text-gray-500">
                  Calculated after address confirmation
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <span className="text-base font-bold">Total</span>
                <div className="text-right">
                  <p className="text-xs text-gray-500">INR</p>
                  <p className="text-2xl font-black text-[#28551f]">
                    {formatPrice(subtotal)}
                  </p>
                </div>
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Shipping charges, if applicable, will be confirmed before
                your order is finalized.
              </p>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-xl border border-[#e3eadc] bg-white p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-[#28551f]"
              />
              <div>
                <p className="text-sm font-bold">
                  Freshness comes first
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Farmer2Family brings farm-fresh products closer to your
                  family.
                </p>
              </div>
            </div>

            <Link
              href="/cart"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#28551f] hover:underline"
            >
              <ArrowLeft size={15} />
              Edit cart
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}