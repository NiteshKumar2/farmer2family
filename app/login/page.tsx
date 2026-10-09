"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  async function handleGoogleLogin() {
    await signIn("google", {
      callbackUrl: "/",
    });
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6b875e]">
            FARM → FAMILY
          </p>

          <h1 className="mt-3 text-3xl font-black text-[#26351f]">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-600">
            Login to your Farmer2Family account.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-3 font-bold text-gray-800 shadow-sm transition hover:bg-gray-50"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42z"
            />
            <path
              fill="#34A853"
              d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.6z"
            />
            <path
              fill="#FBBC05"
              d="M6.53 13.69a5.86 5.86 0 0 1 0-3.38V7.78H3.28a9.76 9.76 0 0 0 0 8.44l3.25-2.53z"
            />
            <path
              fill="#EA4335"
              d="M12 6.28c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.27 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.72 5.38l3.25 2.53C7.3 8 9.46 6.28 12 6.28z"
            />
          </svg>

          Continue with Google
        </button>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-600">
          New to Farmer2Family?{" "}
          <Link
            href="/register"
            className="font-bold text-[#28551f]"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}