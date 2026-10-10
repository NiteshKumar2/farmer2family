
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminOrdersDashboard from "@/components/admin/AdminOrdersDashboard";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Forders");
  }

  if (!(await isAdmin())) {
    redirect("/");
  }

  return (
    <>
      <div className="border-b bg-white px-4 py-4 sm:px-6">
        <Link
          href="/admin"
          className="font-semibold text-green-800 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <AdminOrdersDashboard />
    </>
  );
}