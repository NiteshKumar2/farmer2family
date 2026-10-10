import { auth } from "@/auth";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email || !session?.user) {
    return false;
  }

  const adminEmails = getAdminEmails();

  return adminEmails.includes(email);
}