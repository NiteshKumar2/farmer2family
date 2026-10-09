
"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";

type DeliveryResult = {
  success: boolean;
  pincode?: string;
  deliveryCharge?: number;
  message: string;
};

type OrderResult = {
  success?: boolean;
  orderId?: string;
  error?: string;
  message?: string;
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [pincode, setPincode] = useState("");
  const [verifiedPincode, setVerifiedPincode] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState<number | null>(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);

  // Prevent older PIN-code requests from overwriting newer results.
  const requestId = useRef(0);

  const deliveryVerified =
    verifiedPincode === pincode &&
    /^\d{6}$/.test(pincode) &&
    deliveryCharge !== null;

  const total =
    subtotal + (deliveryVerified ? deliveryCharge ?? 0 : 0);

  async function checkDelivery(code: string): Promise<number | null> {
    const currentRequest = ++requestId.current;

    setDeliveryCharge(null);
    setVerifiedPincode("");
    setDeliveryMessage("");

    if (!/^\d{6}$/.test(code)) {
      setDeliveryMessage("Enter a valid 6-digit PIN code.");
      setCheckingDelivery(false);
      return null;
    }

    setCheckingDelivery(true);

    try {
      const response = await axios.post<DeliveryResult>(
        "/api/delivery",
        { pincode: code }
      );

      const result = response.data;
      const charge = result.deliveryCharge;

      if (
        !result.success ||
        typeof charge !== "number" ||
        !Number.isFinite(charge) ||
        charge < 0
      ) {
        if (requestId.current === currentRequest) {
          setDeliveryMessage(
            result.message ||
              "Delivery is not available for this PIN code."
          );
        }

        return null;
      }

      if (requestId.current !== currentRequest) {
        return null;
      }

      setDeliveryCharge(charge);
      setVerifiedPincode(code);
      setDeliveryMessage(
        result.message || "Delivery is available for this PIN code."
      );

      return charge;
    } catch (error: unknown) {
      if (requestId.current === currentRequest) {
        if (axios.isAxiosError<DeliveryResult>(error)) {
          setDeliveryMessage(
            error.response?.data?.message ||
              "Unable to check delivery. Please try again."
          );
        } else {
          setDeliveryMessage("Something went wrong. Please try again.");
        }
      }

      return null;
    } finally {
      if (requestId.current === currentRequest) {
        setCheckingDelivery(false);
      }
    }
  }

  function handlePincodeChange(value: string) {
    // Invalidate any pending delivery request.
    requestId.current += 1;

    const code = value.replace(/\D/g, "").slice(0, 6);

    setPincode(code);
    setDeliveryCharge(null);
    setVerifiedPincode("");
    setDeliveryMessage("");
    setCheckingDelivery(false);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (submitting) return;

    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    if (paymentMethod !== "cod") {
      setMessage(
        "Online payment is not available yet. Please select Cash on delivery."
      );
      return;
    }

    setSubmitting(true);

    try {
      // Recheck delivery immediately before submitting the order.
      const verifiedCharge = await checkDelivery(pincode);

      if (verifiedCharge === null) {
        setMessage(
          "Please enter a serviceable PIN code before placing your order."
        );
        return;
      }

      const formData = new FormData(form);

      const firstName = String(
        formData.get("firstName") || ""
      ).trim();

      const lastName = String(
        formData.get("lastName") || ""
      ).trim();

      const customer = {
        name: `${firstName} ${lastName}`.trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        address: String(formData.get("address") || "").trim(),
        landmark: String(formData.get("landmark") || "").trim(),
        city: String(formData.get("city") || "").trim(),
        state: String(formData.get("state") || "").trim(),
        pincode,
        notes: String(formData.get("notes") || "").trim(),
      };

      // Prices and totals must be calculated and validated by the API.
      const response = await axios.post<OrderResult>("/api/orders", {
        customer,
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        paymentMethod: "cod",
      });

      const orderId = response.data?.orderId;

      if (!orderId) {
        throw new Error(
          response.data?.message ||
            "The server did not return an order ID."
        );
      }

      // Only clear the cart after the API confirms order creation.
      clearCart();

      router.push(
        `/order-success?orderId=${encodeURIComponent(String(orderId))}`
      );
    } catch (error: unknown) {
      if (axios.isAxiosError<OrderResult>(error)) {
        setMessage(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Unable to place your order. Please try again."
        );
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10";

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-8 text-[#26351f] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#28551f] hover:underline"
        >
          <span aria-hidden="true">←</span> Back to cart
        </Link>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Checkout
        </h1>

        <p className="mb-8 mt-2 text-sm text-gray-600">
          Fresh products, delivered to your doorstep.
        </p>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Add some fresh products before checkout.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-[#28551f] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Shop products
            </Link>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8"
          >
            <div className="space-y-6">
              {/* Contact information */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
                <h2 className="mb-5 text-xl font-semibold">
                  Contact information
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    First name *
                    <input
                      name="firstName"
                      required
                      autoComplete="given-name"
                      className={inputClass}
                      placeholder="First name"
                    />
                  </label>

                  <label className="text-sm font-medium">
                    Last name *
                    <input
                      name="lastName"
                      required
                      autoComplete="family-name"
                      className={inputClass}
                      placeholder="Last name"
                    />
                  </label>

                  <label className="text-sm font-medium sm:col-span-2">
                    Email address *
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="text-sm font-medium sm:col-span-2">
                    Mobile number *
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      className={inputClass}
                      placeholder="10-digit mobile number"
                      title="Enter a valid 10-digit Indian mobile number"
                    />
                  </label>
                </div>
              </section>

              {/* Delivery address */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
                <h2 className="mb-5 text-xl font-semibold">
                  Delivery address
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    House number and street address *
                    <input
                      name="address"
                      required
                      autoComplete="street-address"
                      className={inputClass}
                      placeholder="House number, street, area"
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Landmark
                    <input
                      name="landmark"
                      className={inputClass}
                      placeholder="Nearby landmark (optional)"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium">
                      City *
                      <input
                        name="city"
                        required
                        autoComplete="address-level2"
                        className={inputClass}
                        placeholder="City"
                      />
                    </label>

                    <label className="text-sm font-medium">
                      State *
                      <select
                        name="state"
                        required
                        defaultValue=""
                        autoComplete="address-level1"
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select state
                        </option>

                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block text-sm font-medium">
                    PIN code *
                    <input
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(event) =>
                        handlePincodeChange(event.target.value)
                      }
                      onBlur={() => {
                        if (
                          pincode.length === 6 &&
                          !deliveryVerified &&
                          !checkingDelivery
                        ) {
                          void checkDelivery(pincode);
                        }
                      }}
                      className={inputClass}
                      placeholder="Enter 6-digit PIN code"
                    />

                    {deliveryMessage && (
                      <span
                        role="status"
                        className={`mt-2 block text-sm ${
                          deliveryVerified
                            ? "text-[#28551f]"
                            : "text-red-600"
                        }`}
                      >
                        {deliveryMessage}
                      </span>
                    )}

                    {checkingDelivery && (
                      <span
                        role="status"
                        className="mt-2 block text-sm text-gray-500"
                      >
                        Checking delivery availability...
                      </span>
                    )}
                  </label>

                  <label className="block text-sm font-medium">
                    Order notes
                    <textarea
                      name="notes"
                      rows={3}
                      className={inputClass}
                      placeholder="Special delivery instructions (optional)"
                    />
                  </label>
                </div>
              </section>

              {/* Payment method */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
                <h2 className="mb-4 text-xl font-semibold">
                  Payment method
                </h2>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-[#28551f]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    className="mt-1 accent-[#28551f]"
                  />

                  <span>
                    <span className="block font-semibold">
                      Cash on delivery
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">
                      Pay when your order arrives.
                    </span>
                  </span>
                </label>

                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-[#28551f]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    className="mt-1 accent-[#28551f]"
                  />

                  <span>
                    <span className="block font-semibold">
                      Online payment
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">
                      Online payment is not available yet.
                    </span>
                  </span>
                </label>
              </section>

              {message && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || checkingDelivery}
                className="w-full rounded-xl bg-[#28551f] px-6 py-4 font-semibold text-white transition hover:bg-[#21451a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Placing your order..."
                  : paymentMethod === "cod"
                    ? "Place COD Order"
                    : "Online payment unavailable"}
              </button>

              <p className="text-center text-xs text-gray-500">
                Your order will be submitted after successful validation.
              </p>
            </div>

            {/* Order summary */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 lg:sticky lg:top-6">
              <h2 className="mb-5 text-xl font-semibold">
                Order summary
              </h2>

              <div className="max-h-80 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="wrap-break-words font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-gray-500">
                        Qty: {item.quantity}
                        {item.unit ? ` · ${item.unit}` : ""}
                      </p>
                    </div>

                    <p className="shrink-0 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">
                    Delivery charge
                  </span>

                  <span className="font-medium">
                    {!deliveryVerified
                      ? "To be confirmed"
                      : deliveryCharge === 0
                        ? "FREE"
                        : formatPrice(deliveryCharge ?? 0)}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex justify-between gap-3 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {!deliveryVerified && (
                <p className="mt-3 text-xs text-gray-500">
                  Enter a serviceable PIN code to confirm delivery
                  charges and the final total.
                </p>
              )}

              <Link
                href="/cart"
                className="mt-5 block text-center text-sm font-medium text-[#28551f] hover:underline"
              >
                Edit cart
              </Link>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}