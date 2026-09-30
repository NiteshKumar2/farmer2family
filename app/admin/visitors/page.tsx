"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVisitors(data.visitors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-2 text-3xl font-bold">
          Admin - Visitor Registrations
        </h1>

        <p className="mb-6 text-gray-600">
          Total Visitors: {visitors.length}
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Mobile</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Purpose</th>
                  <th className="p-4 text-left">Visit Date</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map((visitor) => (
                  <tr
                    key={visitor._id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {visitor.name}
                    </td>

                    <td className="p-4">
                      {visitor.mobile}
                    </td>

                    <td className="p-4">
                      {visitor.email || "-"}
                    </td>

                    <td className="p-4">
                      {visitor.purpose || "-"}
                    </td>

                    <td className="p-4">
                      {new Date(
                        visitor.visitDate
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}