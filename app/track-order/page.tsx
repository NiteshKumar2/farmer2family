"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type TrackedItem = {
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
};

type StatusHistoryEntry = {
  status: string;
  note: string;
  changedAt: string;
};

type TrackedOrder = {
  id: string;
  createdAt: string;
  items: TrackedItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  estimatedDeliveryDate: string;
  statusHistory: StatusHistoryEntry[];
};

const STATUS_STEPS = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function statusClass(status: string) {
  if (status === "Delivered") {
    return "bg-green-100 text-green-800";
  }

  if (status === "Cancelled") {
    return "bg-red-100 text-red-800";
  }

  return "bg-amber-100 text-amber-800";
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to track your order.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to track your order."
      );
    } finally {
      setLoading(false);
    }
  }

  const isCancelled = order?.status === "Cancelled";
  const currentStep = order
    ? STATUS_STEPS.indexOf(order.status)
    : -1;

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-10 text-[#26351f] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-medium text-green-800 hover:underline"
        >
          ← Back to Farmer2Family
        </Link>

        <header className="mb-8 mt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Farmer2Family
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Enter your order ID and the email address you used at checkout
            to check your delivery progress.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="orderId"
                className="mb-2 block text-sm font-semibold"
              >
                Order ID
              </label>

              <input
                id="orderId"
                name="orderId"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Enter the order ID from your confirmation"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email used when placing the order"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Checking your order..." : "Track Order"}
            </button>
          </form>
        </section>

        {order && (
          <section className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>

                  <h2 className="mt-1 break-all text-lg font-bold">
                    #{order.id}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Ordered on {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${statusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-6 rounded-xl bg-green-50 p-5">
                <p className="text-sm font-medium text-green-900">
                  Estimated delivery
                </p>

                <p className="mt-2 text-2xl font-bold text-green-900">
                  {formatDate(order.estimatedDeliveryDate)}
                </p>

                <p className="mt-2 text-sm text-green-800">
                  Delivery dates are estimates and may change as your order
                  progresses.
                </p>
              </div>

              {isCancelled ? (
                <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                  This order has been cancelled. Please contact our team if
                  you need help.
                </div>
              ) : (
                <div className="mt-8">
                  <h3 className="mb-6 font-bold">Delivery progress</h3>

                  <ol className="space-y-5">
                    {STATUS_STEPS.map((step, index) => {
                      const completed =
                        currentStep >= 0 && index <= currentStep;

                      const isCurrent = index === currentStep;

                      return (
                        <li
                          key={step}
                          className="flex items-start gap-3"
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              completed
                                ? "bg-green-700 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {completed ? "✓" : index + 1}
                          </span>

                          <div className="pt-1">
                            <p
                              className={`font-semibold ${
                                isCurrent
                                  ? "text-green-800"
                                  : completed
                                    ? "text-gray-800"
                                    : "text-gray-400"
                              }`}
                            >
                              {step}
                            </p>

                            {isCurrent && (
                              <p className="mt-1 text-sm text-gray-500">
                                Current order status
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="text-lg font-bold">Order items</h3>

              <div className="mt-4 divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-start justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity} {item.unit}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery charge</span>
                  <span>{formatCurrency(order.deliveryCharge)}</span>
                </div>

                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment method</span>
                  <span>{order.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment status</span>
                  <span>{order.paymentStatus}</span>
                </div>
              </div>
            </div>

            {order.statusHistory.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <h3 className="text-lg font-bold">Order updates</h3>

                <ol className="mt-5 space-y-5">
                  {[...order.statusHistory]
                    .reverse()
                    .map((entry, index) => (
                      <li
                        key={`${entry.changedAt}-${index}`}
                        className="border-l-2 border-green-200 pl-4"
                      >
                        <p className="font-semibold">{entry.status}</p>

                        {entry.note && (
                          <p className="mt-1 text-sm text-gray-600">
                            {entry.note}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(entry.changedAt)}
                        </p>
                      </li>
                    ))}
                </ol>
              </div>
            )}
          </section>
        )}

        <footer className="mt-10 text-center text-sm text-gray-500">
          Need help with your order? Contact the Farmer2Family team.
        </footer>
      </div>
    </main>
  );
}