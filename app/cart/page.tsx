"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  ImageOff,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 40;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

type CartProductImageProps = {
  image?: string | null;
  name: string;
};

function CartProductImage({ image, name }: CartProductImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const imageValue = image?.trim() ?? "";

  const isImageUrl =
    imageValue.startsWith("data:image/") ||
    /^https?:\/\//i.test(imageValue) ||
    imageValue.startsWith("/");

  if (isImageUrl && !imageFailed) {
    return (
      <img
        src={imageValue}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  if (imageValue && !isImageUrl) {
    return (
      <span
        className="text-4xl sm:text-5xl"
        role="img"
        aria-label={name}
      >
        {imageValue}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-[#9aaa8d]">
      <ImageOff size={30} strokeWidth={1.4} />
      <span className="text-center text-[10px] text-gray-500">
        Image unavailable
      </span>
    </div>
  );
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
  const [promoMessage, setPromoMessage] = useState("");

  const deliveryCharge =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_CHARGE;

  const total = subtotal + deliveryCharge;

  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal,
  );

  const deliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_THRESHOLD) * 100,
  );

  function handlePromoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCode = promoCode.trim();

    if (!trimmedCode) {
      setPromoMessage("Please enter a promo code.");
      return;
    }

    setPromoCode(trimmedCode);
    setPromoMessage(
      "Your code has not been validated. Any discount must be confirmed at checkout.",
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#292d24]">
      {/* Announcement bar */}
      <div className="bg-[#28551f] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        <span className="inline-flex items-center justify-center gap-2">
          <Leaf size={15} />
          Fresh goodness for your family — welcome to Farmer2Family
        </span>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-2 text-sm text-gray-500"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition hover:text-[#28551f]">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-[#28551f]">Your cart</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-7 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d7862c]">
              From our farm to your family
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your shopping cart
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Fresh essentials, carefully selected for your home.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-[#edf4e7] px-4 py-2.5 text-sm font-semibold text-[#28551f]">
              <ShoppingBag size={17} />
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </div>
          )}
        </div>

        {/* Empty cart */}
        {items.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 text-center sm:py-24">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#edf4e7] text-[#28551f]">
              <ShoppingBag size={42} strokeWidth={1.4} />
            </div>

            <h2 className="mt-7 text-2xl font-bold sm:text-3xl">
              Your cart is waiting for you
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              You haven&apos;t added any products yet. Explore fresh
              produce and everyday essentials from Farmer2Family.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#28551f] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#1c4017]"
            >
              Explore products
              <ArrowRight size={17} />
            </Link>

            <div className="mt-12 grid grid-cols-1 gap-4 border-t border-gray-200 pt-7 sm:grid-cols-3">
              <div className="rounded-xl p-3">
                <Leaf className="mx-auto text-[#527345]" size={25} />
                <p className="mt-2 text-sm font-semibold">Fresh choices</p>
                <p className="mt-1 text-xs text-gray-500">
                  Everyday essentials
                </p>
              </div>

              <div className="rounded-xl p-3">
                <Truck className="mx-auto text-[#527345]" size={25} />
                <p className="mt-2 text-sm font-semibold">Easy ordering</p>
                <p className="mt-1 text-xs text-gray-500">
                  Simple shopping
                </p>
              </div>

              <div className="rounded-xl p-3">
                <ShieldCheck className="mx-auto text-[#527345]" size={25} />
                <p className="mt-2 text-sm font-semibold">Peace of mind</p>
                <p className="mt-1 text-xs text-gray-500">
                  Clear order summary
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-10">
            {/* Cart products */}
            <section className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Shopping bag</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Review your products and quantities.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Clear cart
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {items.map((item) => (
                  <article
                    key={item._id}
                    className="group flex gap-3 border-b border-gray-100 p-4 last:border-b-0 sm:gap-5 sm:p-5"
                  >
                    {/* Product image */}
                    <Link
                      href={`/products/${item._id}`}
                      aria-label={`View ${item.name}`}
                      className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f5ec] sm:h-32 sm:w-32"
                    >
                      <CartProductImage
                        image={item.image}
                        name={item.name}
                      />
                    </Link>

                    {/* Product details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:gap-5">
                      <div className="min-w-0">
                        <Link href={`/products/${item._id}`}>
                          <h3 className="line-clamp-2 font-bold leading-6 transition hover:text-[#28551f]">
                            {item.name}
                          </h3>
                        </Link>

                        {item.unit && (
                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Per {item.unit}
                          </p>
                        )}

                        <p className="mt-2 font-bold text-[#28551f]">
                          {formatPrice(item.price)}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-red-600"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>

                      {/* Quantity and line total */}
                      <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                        <div className="flex h-9 items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(
                                    item._id,
                                    item.quantity - 1,
                                  )
                                : removeFromCart(item._id)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-full w-9 items-center justify-center text-gray-600 transition hover:bg-[#edf4e7] hover:text-[#28551f]"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 size={14} />
                            ) : (
                              <Minus size={15} />
                            )}
                          </button>

                          <span
                            className="min-w-8 text-center text-sm font-bold tabular-nums"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.quantity + 1,
                              )
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-full w-9 items-center justify-center text-gray-600 transition hover:bg-[#edf4e7] hover:text-[#28551f]"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <p className="text-sm font-bold sm:mt-2 sm:text-base">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#28551f] transition hover:text-[#d7862c]"
              >
                <ArrowLeft size={16} />
                Continue shopping
              </Link>

              {/* Account note */}
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="rounded-full bg-[#edf4e7] p-2 text-[#28551f]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-bold">A smoother checkout</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Continue to checkout to enter your delivery details.
                    Sign-in options can be provided there if enabled.
                  </p>
                </div>
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold">Order summary</h2>

              <p className="mt-1 text-sm text-gray-500">
                Your order at a glance
              </p>

              {/* Delivery progress */}
              <div className="mt-5 rounded-xl bg-[#f2f6ed] p-4">
                {remainingForFreeDelivery > 0 ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Truck
                        size={21}
                        className="mt-0.5 shrink-0 text-[#28551f]"
                      />

                      <p className="text-sm leading-6 text-[#28551f]">
                        Add{" "}
                        <strong>
                          {formatPrice(remainingForFreeDelivery)}
                        </strong>{" "}
                        more for free delivery.
                      </p>
                    </div>

                    <div
                      className="mt-4 h-2 overflow-hidden rounded-full bg-white"
                      role="progressbar"
                      aria-label="Progress toward free delivery"
                      aria-valuemin={0}
                      aria-valuemax={FREE_DELIVERY_THRESHOLD}
                      aria-valuenow={Math.min(
                        subtotal,
                        FREE_DELIVERY_THRESHOLD,
                      )}
                    >
                      <div
                        className="h-full rounded-full bg-[#28551f] transition-all duration-300"
                        style={{ width: `${deliveryProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-sm font-semibold text-[#28551f]">
                    <Truck size={21} />
                    Congratulations! Delivery is free.
                  </div>
                )}
              </div>

              {/* Promo code */}
              <div className="border-b border-gray-200 py-5">
                <button
                  type="button"
                  onClick={() => setPromoOpen((open) => !open)}
                  aria-expanded={promoOpen}
                  className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={17} className="text-[#28551f]" />
                    Have a promo code?
                  </span>

                  <span className="text-xl text-gray-500">
                    {promoOpen ? "−" : "+"}
                  </span>
                </button>

                {promoOpen && (
                  <form onSubmit={handlePromoSubmit} className="mt-4">
                    <label
                      htmlFor="promo-code"
                      className="mb-2 block text-xs font-medium text-gray-600"
                    >
                      Enter your discount code
                    </label>

                    <div className="flex gap-2">
                      <input
                        id="promo-code"
                        name="promoCode"
                        value={promoCode}
                        onChange={(event) => {
                          setPromoCode(event.target.value);
                          setPromoMessage("");
                        }}
                        placeholder="Enter code"
                        autoComplete="off"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                      />

                      <button
                        type="submit"
                        className="rounded-lg bg-[#28551f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1c4017]"
                      >
                        Check
                      </button>
                    </div>

                    {promoMessage && (
                      <p
                        role="status"
                        className="mt-2 text-xs leading-5 text-gray-500"
                      >
                        {promoMessage}
                      </p>
                    )}

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      A discount is not applied until your code is
                      validated by the checkout system.
                    </p>
                  </form>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-4 border-b border-gray-200 py-5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-600">
                    Subtotal ({cartCount}{" "}
                    {cartCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-600">Delivery</span>
                  <span
                    className={
                      deliveryCharge === 0
                        ? "font-bold text-[#28551f]"
                        : "font-semibold tabular-nums"
                    }
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-start justify-between gap-3 py-5">
                <div>
                  <p className="font-bold">Estimated total</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Final charges confirmed at checkout
                  </p>
                </div>

                <p className="text-xl font-extrabold text-[#28551f] sm:text-2xl">
                  {formatPrice(total)}
                </p>
              </div>

              {/* Checkout */}
              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#28551f] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#1c4017] active:scale-[0.99]"
              >
                Proceed to checkout
                <ArrowRight size={18} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={15} className="text-[#28551f]" />
                Secure and simple checkout
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                Delivery availability and final charges may depend on
                your delivery address.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
