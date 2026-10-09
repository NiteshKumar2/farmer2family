"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-sm text-gray-400">
        Loading...
      </span>
    );
  }

  if (!session?.user) {
    return (
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
          })
        }
        className="rounded-full bg-[#28551f] px-5 py-2 font-bold text-white transition hover:bg-[#1c3e17]"
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="font-bold text-[#28551f]"
      >
        {session.user.name}
      </Link>

      <button
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
        className="text-sm font-bold text-red-600"
      >
        Logout
      </button>
    </div>
  );
}