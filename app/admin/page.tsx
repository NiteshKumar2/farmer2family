import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminOrdersDashboard from "@/components/admin/AdminOrdersDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin");
  }

  if (!(await isAdmin())) {
    redirect("/");
  }

  return <AdminOrdersDashboard />;
}