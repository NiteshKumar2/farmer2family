"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);

    const data = {
      name: form.get("name"),
      mobile: form.get("mobile"),
      email: form.get("email"),
      address: form.get("address"),
      purpose: form.get("purpose"),
      visitDate: form.get("visitDate"),
    };

    try {
      const response = await fetch("/api/visitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setMessage("Registration successful!");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-3xl font-bold">
          Visitor Registration
        </h1>

        <p className="mb-6 text-gray-600">
          Please fill in your details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            name="mobile"
            type="tel"
            placeholder="Mobile Number"
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg border p-3"
          />

          <textarea
            name="address"
            placeholder="Address"
            rows={3}
            className="w-full rounded-lg border p-3"
          />

          <input
            name="purpose"
            type="text"
            placeholder="Purpose of Visit"
            className="w-full rounded-lg border p-3"
          />

          <input
            name="visitDate"
            type="date"
            required
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading
              ? "Registering..."
              : "Register Visitor"}
          </button>

          {message && (
            <p className="rounded-lg bg-gray-100 p-3 text-center">
              {message}
            </p>
          )}

        </form>
      </div>
    </main>
  );
}
