
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
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

type CustomerOrder = {
  id: string;
  createdAt: string;
  items: OrderItem[];
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
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders/track", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load your orders."
          );
        }

        setOrders(data.orders || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-10 text-[#26351f] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-medium text-green-800 hover:underline"
        >
          ← Back to Farmer2Family
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Farmer2Family
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-3 text-gray-600">
            View your orders, estimated delivery dates, and delivery progress.
          </p>
        </header>

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            Loading your orders...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
          >
            <p>{error}</p>

            {error.toLowerCase().includes("sign in") && (
              <Link
                href="/api/auth/signin?callbackUrl=%2Ftrack-order"
                className="mt-3 inline-block font-semibold underline"
              >
                Sign in with Google
              </Link>
            )}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold">No orders yet</h2>

            <p className="mt-2 text-gray-600">
              Your orders will appear here after you place an order using
              your signed-in email address.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-block rounded-lg bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const cancelled = order.status === "Cancelled";
            const currentStep = STATUS_STEPS.indexOf(order.status);

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>

                      <h2 className="mt-1 break-all font-bold">
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

                  <div className="mt-5 rounded-xl bg-green-50 p-4">
                    <p className="text-sm text-green-800">
                      Estimated delivery
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-900">
                      {formatDate(order.estimatedDeliveryDate)}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-bold">Delivery progress</h3>

                  {cancelled ? (
                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                      This order has been cancelled. Please contact our team
                      if you need assistance.
                    </p>
                  ) : (
                    <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {STATUS_STEPS.map((step, index) => {
                        const completed =
                          currentStep >= 0 && index <= currentStep;

                        return (
                          <li key={step} className="flex items-center gap-2">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                completed
                                  ? "bg-green-700 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {completed ? "✓" : index + 1}
                            </span>

                            <span
                              className={`text-sm ${
                                index === currentStep
                                  ? "font-bold text-green-800"
                                  : completed
                                    ? "text-gray-800"
                                    : "text-gray-400"
                              }`}
                            >
                              {step}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <h3 className="font-bold">Items</h3>

                    <div className="mt-3 divide-y divide-gray-100">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.name}-${index}`}
                          className="flex justify-between gap-4 py-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity} {item.unit}
                            </p>
                          </div>

                          <p className="whitespace-nowrap font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 space-y-3 border-t border-gray-100 pt-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Delivery charge</span>
                      <span>{formatCurrency(order.deliveryCharge)}</span>
                    </div>

                    <div className="flex justify-between gap-4 text-base font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Payment method</span>
                      <span>{order.paymentMethod}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Payment status</span>
                      <span>{order.paymentStatus}</span>
                    </div>
                  </div>

                  {order.statusHistory?.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <h3 className="font-bold">Order updates</h3>

                      <ol className="mt-4 space-y-4">
                        {[...order.statusHistory]
                          .reverse()
                          .map((entry, index) => (
                            <li
                              key={`${entry.changedAt}-${index}`}
                              className="border-l-2 border-green-200 pl-4"
                            >
                              <p className="font-semibold">
                                {entry.status}
                              </p>

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
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}