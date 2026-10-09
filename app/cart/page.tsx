
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 40;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function CartPage() {
  const {
    items,
    cartCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const deliveryCharge =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_CHARGE;

  const total = subtotal + deliveryCharge;
  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal
  );

  return (
    <main className="min-h-screen bg-white text-[#292d24]">
      {/* Announcement bar */}
      <div className="bg-[#28551f] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        Fresh goodness for your family — welcome to Farmer2Family
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#28551f]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#28551f]">Cart</span>
        </nav>
      </div>

      {/* Cart heading */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d7862c]">
              From our farm to your family
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your cart
            </h1>
          </div>

          {items.length > 0 && (
            <span className="rounded-full bg-[#f1f5eb] px-4 py-2 text-sm font-medium text-[#28551f]">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty cart */
          <div className="mx-auto max-w-2xl py-16 text-center sm:py-24">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f2f5ed] text-5xl">
              🛒
            </div>

            <h2 className="mt-7 text-2xl font-semibold sm:text-3xl">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Looks like you haven&apos;t added anything yet. Discover
              wholesome products and bring farm-fresh goodness home.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#28551f] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1c4017]"
            >
              Continue shopping
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </Link>

            <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-4 border-t border-gray-100 pt-7 sm:grid-cols-3">
              <div>
                <span className="text-2xl">🌱</span>
                <p className="mt-2 text-sm font-medium">Farm goodness</p>
              </div>
              <div>
                <span className="text-2xl">🥬</span>
                <p className="mt-2 text-sm font-medium">Everyday essentials</p>
              </div>
              <div>
                <span className="text-2xl">📦</span>
                <p className="mt-2 text-sm font-medium">Easy ordering</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            {/* Products */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Shopping bag
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm text-gray-500 underline underline-offset-4 hover:text-red-600"
                >
                  Clear cart
                </button>
              </div>

              <div className="divide-y divide-gray-200 border-y border-gray-200">
                {items.map((item) => {
                  const isUrl =
                    !!item.image &&
                    (item.image.startsWith("/") ||
                      item.image.startsWith("https://") ||
                      item.image.startsWith("http://"));

                  return (
                    <article
                      key={item._id}
                      className="flex gap-4 py-5 sm:gap-6"
                    >
                      {/* Image */}
                      <div className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f6f6f0] sm:h-32 sm:w-32">
                        {isUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-4xl">
                            {item.image || "🌱"}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:gap-5">
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-6">
                            {item.name}
                          </h3>

                          {item.unit && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.unit}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-medium text-[#28551f]">
                            {formatPrice(item.price)}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="mt-3 text-xs text-gray-500 underline underline-offset-4 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                          <div className="flex h-9 items-center rounded-full border border-gray-300">
                            <button
                              type="button"
                              onClick={() =>
                                item.quantity > 1
                                  ? updateQuantity(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  : removeFromCart(item._id)
                              }
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="h-9 w-9 rounded-l-full text-lg hover:bg-gray-100"
                            >
                              −
                            </button>

                            <span className="min-w-7 text-center text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              aria-label={`Increase quantity of ${item.name}`}
                              className="h-9 w-9 rounded-r-full text-lg hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          <p className="font-semibold sm:mt-2">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#28551f] hover:underline"
              >
                <span aria-hidden="true">←</span>
                Continue shopping
              </Link>

              {/* Account prompt */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="font-semibold">Have an account?</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in during checkout to use your account details
                  and make ordering easier.
                </p>
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-xl border border-gray-200 bg-[#fcfcf9] p-5 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold">
                Order summary
              </h2>

              {remainingForFreeDelivery > 0 ? (
                <div className="mt-5 rounded-lg bg-[#f1f5eb] p-4">
                  <p className="text-sm leading-6 text-[#28551f]">
                    Add{" "}
                    <strong>
                      {formatPrice(remainingForFreeDelivery)}
                    </strong>{" "}
                    more to qualify for free delivery.
                  </p>

                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"
                    role="progressbar"
                    aria-label="Progress toward free delivery"
                    aria-valuemin={0}
                    aria-valuemax={FREE_DELIVERY_THRESHOLD}
                    aria-valuenow={Math.min(
                      subtotal,
                      FREE_DELIVERY_THRESHOLD
                    )}
                  >
                    <div
                      className="h-full rounded-full bg-[#28551f] transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (subtotal / FREE_DELIVERY_THRESHOLD) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-lg bg-[#f1f5eb] p-3 text-sm font-medium text-[#28551f]">
                  ✓ You qualify for free delivery!
                </p>
              )}

              {/* Promo code */}
              <div className="mt-5 border-b border-gray-200 pb-5">
                <button
                  type="button"
                  onClick={() => setPromoOpen(!promoOpen)}
                  aria-expanded={promoOpen}
                  className="flex w-full items-center justify-between py-1 text-left text-sm font-medium"
                >
                  Have a promo code?
                  <span className="text-lg text-gray-500">
                    {promoOpen ? "−" : "+"}
                  </span>
                </button>

                {promoOpen && (
                  <form
                    className="mt-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setPromoCode(promoCode.trim());
                    }}
                  >
                    <label
                      htmlFor="promo-code"
                      className="mb-2 block text-xs text-gray-500"
                    >
                      Enter your discount code at checkout.
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="promo-code"
                        value={promoCode}
                        onChange={(event) =>
                          setPromoCode(event.target.value)
                        }
                        placeholder="Promo code"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#28551f]"
                      />
                      <Link
                        href="/checkout"
                        className="inline-flex items-center justify-center rounded-lg bg-[#28551f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c4017]"
                      >
                        Apply
                      </Link>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Discounts must be validated during checkout.
                    </p>
                  </form>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4 border-b border-gray-200 py-5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">
                    Subtotal ({cartCount}{" "}
                    {cartCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 py-5">
                <div>
                  <p className="font-semibold">Estimated total</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Taxes included where applicable
                  </p>
                </div>
                <p className="text-xl font-bold text-[#28551f]">
                  {formatPrice(total)}
                </p>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#28551f] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1c4017]"
              >
                Proceed to checkout
                <span aria-hidden="true">→</span>
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                Your delivery charges and order details can be
                confirmed at checkout.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-200 pt-5 text-xs text-gray-500">
                <span aria-hidden="true">🔒</span>
                Secure checkout
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}