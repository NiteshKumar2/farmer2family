
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminProductsPage from "@/components/admin/AdminProductsPage";

export const dynamic = "force-dynamic";

export default async function AdminProductsRoute() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fproducts");
  }

  if (!(await isAdmin())) {
    redirect("/");
  }

  return <AdminProductsPage />;
}
