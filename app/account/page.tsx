import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6b875e]">
            MY ACCOUNT
          </p>

          <h1 className="mt-3 text-3xl font-black text-[#26351f]">
            Welcome, {session.user.name}
          </h1>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-[#fafaf7] p-5">
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-bold text-[#26351f]">
                {session.user.name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fafaf7] p-5">
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-bold text-[#26351f]">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}