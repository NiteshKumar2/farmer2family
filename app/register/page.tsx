"use client";

import { FormEvent, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Leaf,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

const VISIT_START = "2026-10-15";
const VISIT_END = "2026-10-30";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

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
        throw new Error(
          result.message || "Registration failed."
        );
      }

      setSuccess(true);
      setMessage(
        "Your visit has been successfully registered!"
      );

      event.currentTarget.reset();
    } catch (error) {
      setSuccess(false);

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
    <main className="min-h-screen bg-[#f5f7f1]">

      {/* HERO */}

      <section className="bg-[#28551f] px-4 py-14 text-white">

        <div className="mx-auto max-w-5xl">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Leaf size={26} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#d8e8c9]">
                Farmer2Family
              </p>

              <p className="text-sm text-white/70">
                Farm • Food • Family
              </p>
            </div>

          </div>

          <div className="mt-10 max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e5a64b]">
              Visit Registration
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Come visit Farmer2Family
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Register your visit today and experience
              Farmer2Family in person.
            </p>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="px-4 py-10">

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">

          {/* INFORMATION */}

          <div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">

              <h2 className="text-2xl font-black text-[#26351f]">
                Visit Information
              </h2>

              <p className="mt-2 text-gray-600">
                Registration is open now.
              </p>

              <div className="mt-7 space-y-5">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e7] text-[#28551f]">
                    <CalendarDays size={21} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Visit Dates
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      15 October 2026 – 30 October 2026
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e7] text-[#28551f]">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Farmer2Family
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e7] text-[#28551f]">
                    <Phone size={21} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Registration
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Registration is currently open.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="mt-5 rounded-3xl bg-[#e9f0df] p-6">

              <div className="flex gap-3">

                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#28551f]"
                  size={21}
                />

                <div>
                  <p className="font-bold text-[#26351f]">
                    Important
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#4b5d43]">
                    Please select a visit date between
                    15 October and 30 October 2026.
                    Registration is open from now.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">

            <div className="mb-7">

              <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
                Registration Form
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#26351f]">
                Reserve your visit
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Fill in your details below.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Full Name
                </label>

                <div className="relative">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  />

                </div>

              </div>

              {/* MOBILE */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Mobile Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="mobile"
                    type="tel"
                    placeholder="Your mobile number"
                    required
                    maxLength={20}
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Email Address
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  maxLength={150}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />

              </div>

              {/* ADDRESS */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Address
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  name="address"
                  placeholder="Your address"
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />

              </div>

              {/* PURPOSE */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Purpose of Visit
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <input
                  name="purpose"
                  type="text"
                  placeholder="For example: farm visit"
                  maxLength={200}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />

              </div>

              {/* DATE */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Visit Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    name="visitDate"
                    type="date"
                    required
                    min={VISIT_START}
                    max={VISIT_END}
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Available dates: 15 October 2026 to
                  30 October 2026
                </p>

              </div>

              {/* MESSAGE */}

              {message && (
                <div
                  className={`rounded-xl p-4 text-sm font-medium ${
                    success
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#28551f] py-4 font-bold text-white transition hover:bg-[#1e4018] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Registering..."
                  : "Register My Visit"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Your information is used only for visit
                registration.
              </p>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}