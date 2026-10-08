"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
} from "lucide-react";

type Visitor = {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  purpose?: string;
  visitDate: string;
  createdAt: string;
};

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVisitors() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/visitors", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load visitors."
        );
      }

      if (data.success) {
        setVisitors(data.visitors);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load visitors."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisitors();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f7f1]">

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
              Farmer2Family Admin
            </p>

            <h1 className="mt-1 text-3xl font-black text-[#26351f]">
              Visitor Registrations
            </h1>

            <p className="mt-2 text-gray-500">
              Manage people registered for the October
              visit.
            </p>

          </div>

          <button
            onClick={loadVisitors}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full border bg-white px-5 py-3 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>

        {/* STATS */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3e7] text-[#28551f]">
              <UserRound size={21} />
            </div>

            <p className="mt-4 text-3xl font-black text-[#26351f]">
              {visitors.length}
            </p>

            <p className="text-sm text-gray-500">
              Total Registrations
            </p>

          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1df] text-[#d7862c]">
              <CalendarDays size={21} />
            </div>

            <p className="mt-4 text-3xl font-black text-[#26351f]">
              10–30
            </p>

            <p className="text-sm text-gray-500">
              October 2026
            </p>

          </div>

          <div className="col-span-2 rounded-2xl bg-[#28551f] p-5 text-white md:col-span-1">

            <p className="text-sm font-bold text-white/70">
              Registration Status
            </p>

            <p className="mt-2 text-2xl font-black">
              OPEN
            </p>

            <p className="mt-1 text-sm text-white/70">
              Registration is available now
            </p>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading visitor registrations...
            </div>
          ) : visitors.length === 0 ? (
            <div className="p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3e7] text-[#28551f]">
                <UserRound />
              </div>

              <h2 className="mt-4 font-bold">
                No registrations yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                New visitor registrations will appear
                here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="border-b bg-[#f8f9f4]">

                  <tr>

                    <th className="px-5 py-4 text-left text-sm font-bold">
                      Visitor
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-bold">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-bold">
                      Address
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-bold">
                      Purpose
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-bold">
                      Visit Date
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-bold">
                      Registered
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {visitors.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-b last:border-0 hover:bg-[#fafbf8]"
                    >

                      {/* VISITOR */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3e7] font-bold text-[#28551f]">
                            {visitor.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold">
                              {visitor.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              Visitor
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-5">

                        <div className="space-y-1 text-sm">

                          <p className="flex items-center gap-2">
                            <Phone
                              size={14}
                              className="text-gray-400"
                            />

                            {visitor.mobile}
                          </p>

                          {visitor.email && (
                            <p className="flex items-center gap-2 text-gray-500">
                              <Mail
                                size={14}
                                className="text-gray-400"
                              />

                              {visitor.email}
                            </p>
                          )}

                        </div>

                      </td>

                      {/* ADDRESS */}

                      <td className="max-w-[220px] px-5 py-5 text-sm text-gray-600">

                        {visitor.address ? (
                          <div className="flex gap-2">

                            <MapPin
                              size={15}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />

                            <span>
                              {visitor.address}
                            </span>

                          </div>
                        ) : (
                          "-"
                        )}

                      </td>

                      {/* PURPOSE */}

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {visitor.purpose || "-"}
                      </td>

                      {/* VISIT DATE */}

                      <td className="px-5 py-5">

                        <span className="inline-flex items-center gap-2 rounded-full bg-[#edf3e7] px-3 py-1.5 text-sm font-bold text-[#28551f]">

                          <CalendarDays size={14} />

                          {formatDate(visitor.visitDate)}

                        </span>

                      </td>

                      {/* CREATED */}

                      <td className="px-5 py-5 text-sm text-gray-500">
                        {formatDate(visitor.createdAt)}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}