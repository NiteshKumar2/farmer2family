"use client";

import { useCallback, useEffect, useState } from "react";
import {
CalendarDays,
Mail,
MapPin,
Phone,
RefreshCw,
UserRound,
AlertCircle,
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

type VisitorsResponse = {
success: boolean;
visitors?: Visitor[];
message?: string;
};

export default function AdminVisitorsDashboard() {
const [visitors, setVisitors] = useState<Visitor[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadVisitors = useCallback(async () => {
try {
setLoading(true);
setError("");

  const response = await fetch("/api/admin/visitors", {
    cache: "no-store",
  });

  const data: VisitorsResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Unable to load visitor registrations."
    );
  }

  setVisitors(
    Array.isArray(data.visitors) ? data.visitors : []
  );
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Unable to load visitor registrations."
  );
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
void loadVisitors();
}, [loadVisitors]);

function formatDate(date: string) {
if (!date || Number.isNaN(new Date(date).getTime())) {
return "—";
}

return new Date(date).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

}

const visitDates = visitors
.map((visitor) => new Date(visitor.visitDate))
.filter((date) => !Number.isNaN(date.getTime()))
.sort((a, b) => a.getTime() - b.getTime());

const visitDateRange =
visitDates.length === 0
? "No visits scheduled"
: visitDates[0].toLocaleDateString("en-IN", {
day: "2-digit",
month: "short",
year: "numeric",
}) ===
visitDates[visitDates.length - 1].toLocaleDateString(
"en-IN",
{
day: "2-digit",
month: "short",
year: "numeric",
}
)
? formatDate(visitDates[0].toISOString())
: `${visitDates[0].toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })} – ${formatDate(
          visitDates[visitDates.length - 1].toISOString()
        )}`;

return ( <main className="min-h-screen bg-[#f5f7f1] text-[#26351f]"> <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6"> <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"> <div> <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
Farmer2Family Admin </p>

```
        <h1 className="mt-1 text-3xl font-black">
          Visitor Registrations
        </h1>

        <p className="mt-2 text-gray-500">
          View farm visit registrations and visitor contact details.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void loadVisitors()}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-full border bg-white px-5 py-3 text-sm font-bold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          size={17}
          className={loading ? "animate-spin" : ""}
        />
        {loading ? "Refreshing..." : "Refresh"}
      </button>
    </div>

    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3e7] text-[#28551f]">
          <UserRound size={21} />
        </div>

        <p className="mt-4 text-3xl font-black">
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

        <p className="mt-4 text-xl font-black">
          {visitDateRange}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Registered visit dates
        </p>
      </div>

      <div className="rounded-2xl bg-[#28551f] p-5 text-white">
        <p className="text-sm font-bold text-white/70">
          Upcoming Visits
        </p>

        <p className="mt-2 text-3xl font-black">
          {
            visitors.filter((visitor) => {
              const date = new Date(visitor.visitDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return (
                !Number.isNaN(date.getTime()) &&
                date >= today
              );
            }).length
          }
        </p>

        <p className="mt-1 text-sm text-white/70">
          Registrations for today or later
        </p>
      </div>
    </div>

    {error && (
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-bold">Unable to load registrations</p>
          <p className="mt-1">{error}</p>

          <button
            type="button"
            onClick={() => void loadVisitors()}
            className="mt-3 font-bold underline"
          >
            Try again
          </button>
        </div>
      </div>
    )}

    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {loading ? (
        <div className="p-12 text-center text-gray-500">
          Loading visitor registrations...
        </div>
      ) : visitors.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3e7] text-[#28551f]">
            <UserRound size={25} />
          </div>

          <h2 className="mt-4 font-bold">
            No registrations yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            New visitor registrations will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5">
            <thead className="border-b bg-[#f8f9f4]">
              <tr>
                {[
                  "Visitor",
                  "Contact",
                  "Address",
                  "Purpose",
                  "Visit Date",
                  "Registered",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-left text-sm font-bold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visitors.map((visitor) => (
                <tr
                  key={visitor._id}
                  className="border-b last:border-0 hover:bg-[#fafbf8]"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3e7] font-bold text-[#28551f]">
                        {visitor.name?.charAt(0).toUpperCase() || "V"}
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

                  <td className="px-5 py-5">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <Phone
                          size={14}
                          className="shrink-0 text-gray-400"
                        />
                        {visitor.mobile}
                      </p>

                      {visitor.email && (
                        <p className="flex items-center gap-2 text-gray-500">
                          <Mail
                            size={14}
                            className="shrink-0 text-gray-400"
                          />
                          <span className="break-all">
                            {visitor.email}
                          </span>
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="max-w-56 px-5 py-5 text-sm text-gray-600">
                    {visitor.address ? (
                      <div className="flex gap-2">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <span>{visitor.address}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-5 py-5 text-sm text-gray-600">
                    {visitor.purpose || "—"}
                  </td>

                  <td className="px-5 py-5">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#edf3e7] px-3 py-1.5 text-sm font-bold text-[#28551f]">
                      <CalendarDays size={14} />
                      {formatDate(visitor.visitDate)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-500">
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
