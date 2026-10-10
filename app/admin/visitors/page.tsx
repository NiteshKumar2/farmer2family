
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminVisitorsDashboard from "@/components/admin/AdminVisitorsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminVisitorsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fvisitors");
  }

  if (!(await isAdmin())) {
    redirect("/");
  }

  return <AdminVisitorsDashboard />;
}