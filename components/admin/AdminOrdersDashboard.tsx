"use client";

import { useCallback, useEffect, useState } from "react";

const ORDER_STATUSES = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type OrderItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
  unit?: string;
};

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type StatusHistoryItem = {
  status: string;
  note?: string;
  changedAt: string;
};

type AdminOrder = {
  _id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  estimatedDeliveryDate?: string | null;
  adminNote?: string;
  statusHistory?: StatusHistoryItem[];
  createdAt: string;
};

type OrderDraft = {
  status: OrderStatus;
  estimatedDeliveryDate: string;
  adminNote: string;
};

function toDateInput(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function formatDate(value?: string | null): string {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function getStatusStyle(status: string): string {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Shipped":
    case "Out for Delivery":
      return "bg-blue-100 text-blue-800";
    case "Confirmed":
    case "Processing":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [drafts, setDrafts] = useState<Record<string, OrderDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load orders.");
      }

      const fetchedOrders: AdminOrder[] = data.orders || [];

      setOrders(fetchedOrders);

      const nextDrafts: Record<string, OrderDraft> = {};

      for (const order of fetchedOrders) {
        nextDrafts[order._id] = {
          status: order.status,
          estimatedDeliveryDate: toDateInput(
            order.estimatedDeliveryDate
          ),
          adminNote: order.adminNote || "",
        };
      }

      setDrafts(nextDrafts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  function updateDraft(
    orderId: string,
    field: keyof OrderDraft,
    value: string
  ) {
    setDrafts((current) => {
      const existing = current[orderId];

      if (!existing) return current;

      return {
        ...current,
        [orderId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  }

  async function saveOrder(orderId: string) {
    const draft = drafts[orderId];

    if (!draft) return;

    setSavingId(orderId);
    setError("");
    setMessage("");

    try {
      const payload: {
        orderId: string;
        status: OrderStatus;
        adminNote: string;
        estimatedDeliveryDate?: string;
      } = {
        orderId,
        status: draft.status,
        adminNote: draft.adminNote,
      };

      if (draft.estimatedDeliveryDate) {
        payload.estimatedDeliveryDate =
          draft.estimatedDeliveryDate;
      }

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update order.");
      }

      setMessage(`Order #${orderId.slice(-6)} updated successfully.`);

      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update order."
      );
    } finally {
      setSavingId(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      order._id.toLowerCase().includes(searchValue) ||
      order.customer.name.toLowerCase().includes(searchValue) ||
      order.customer.email.toLowerCase().includes(searchValue) ||
      order.customer.phone.includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pendingCount = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  ).length;

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <main className="min-h-screen bg-[#f7f8f3] px-4 py-8 text-gray-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Farmer2Family
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Order Management
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage customer orders, delivery dates and order status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh orders"}
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Orders" value={orders.length} />
          <StatCard label="Awaiting Completion" value={pendingCount} />
          <StatCard label="Delivered Orders" value={deliveredCount} />
          <StatCard
            label="Total Order Value"
            value={formatCurrency(totalOrderValue)}
          />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order ID, name, email or phone..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
          >
            <option value="All">All statuses</option>

            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </section>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-600">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">No orders found</h2>
            <p className="mt-2 text-sm text-gray-500">
              Orders matching your search will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const draft = drafts[order._id];

              if (!draft) return null;

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h2 className="break-all font-bold">
                        #{order._id}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Placed {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <p className="text-xl font-bold">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
                    <section>
                      <h3 className="mb-3 font-semibold">
                        Customer & Delivery
                      </h3>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Name: </span>
                          {order.customer.name}
                        </p>

                        <p className="break-all">
                          <span className="text-gray-500">Email: </span>
                          {order.customer.email}
                        </p>

                        <p>
                          <span className="text-gray-500">Phone: </span>
                          {order.customer.phone}
                        </p>

                        <p>
                          <span className="text-gray-500">Address: </span>
                          {order.customer.address}, {order.customer.city},{" "}
                          {order.customer.state} - {order.customer.pincode}
                        </p>

                        <p>
                          <span className="text-gray-500">
                            Payment:{" "}
                          </span>
                          {order.paymentMethod} · {order.paymentStatus}
                        </p>
                      </div>

                      <h3 className="mb-3 mt-6 font-semibold">
                        Products
                      </h3>

                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="flex justify-between gap-4 rounded-lg bg-gray-50 p-3 text-sm"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="mt-1 text-gray-500">
                                {item.quantity} {item.unit || "unit"}
                                {" × "}
                                {formatCurrency(item.price)}
                              </p>
                            </div>

                            <p className="whitespace-nowrap font-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span>
                            {formatCurrency(order.deliveryCharge)}
                          </span>
                        </div>

                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="mb-3 font-semibold">
                        Update Order
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`status-${order._id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Order status
                          </label>

                          <select
                            id={`status-${order._id}`}
                            value={draft.status}
                            onChange={(event) =>
                              updateDraft(
                                order._id,
                                "status",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`delivery-${order._id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Estimated delivery date
                          </label>

                          <input
                            id={`delivery-${order._id}`}
                            type="date"
                            value={draft.estimatedDeliveryDate}
                            min={(() => {
                              const date = new Date(order.createdAt);
                              date.setUTCDate(date.getUTCDate() + 5);
                              return date.toISOString().slice(0, 10);
                            })()}
                            onChange={(event) =>
                              updateDraft(
                                order._id,
                                "estimatedDeliveryDate",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                          />

                          <p className="mt-1 text-xs text-gray-500">
                            Current estimate:{" "}
                            {formatDate(order.estimatedDeliveryDate)}
                            . Minimum is 5 calendar days after ordering.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor={`note-${order._id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Admin / delivery note
                          </label>

                          <textarea
                            id={`note-${order._id}`}
                            value={draft.adminNote}
                            onChange={(event) =>
                              updateDraft(
                                order._id,
                                "adminNote",
                                event.target.value
                              )
                            }
                            maxLength={1000}
                            rows={3}
                            placeholder="Example: Your order is being prepared."
                            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => void saveOrder(order._id)}
                          disabled={savingId !== null}
                          className="w-full rounded-lg bg-green-800 px-4 py-3 font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingId === order._id
                            ? "Saving changes..."
                            : "Save order changes"}
                        </button>
                      </div>

                      {order.statusHistory &&
                        order.statusHistory.length > 0 && (
                          <div className="mt-6">
                            <h3 className="mb-3 font-semibold">
                              Status history
                            </h3>

                            <ol className="space-y-3 border-l-2 border-green-200 pl-4">
                              {[...order.statusHistory]
                                .reverse()
                                .map((entry, index) => (
                                  <li key={`${entry.changedAt}-${index}`}>
                                    <p className="text-sm font-semibold">
                                      {entry.status}
                                    </p>

                                    {entry.note && (
                                      <p className="mt-0.5 text-sm text-gray-600">
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
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-500">
          Farmer2Family · Admin order management
        </p>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 wrap-break-words text-2xl font-bold">{value}</p>
    </div>
  );
}