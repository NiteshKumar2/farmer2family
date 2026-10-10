import Link from "next/link";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import {
ArrowRight,
ClipboardList,
Leaf,
Package,
ShoppingBag,
Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

const sections = [
{
title: "Product Management",
description:
"Add products, update prices, manage stock, upload images, and control product visibility.",
href: "/admin/products",
icon: Package,
},
{
title: "Order Management",
description:
"Review customer orders, update order statuses, manage delivery dates, and add delivery notes.",
href: "/admin/orders",
icon: ShoppingBag,
},
{
title: "Visitor Registrations",
description:
"View farm visit registrations, contact details, visit dates, and visitor information.",
href: "/admin/visitors",
icon: Users,
},
];

export default async function AdminPage() {
const session = await auth();

if (!session?.user) {
redirect("/api/auth/signin?callbackUrl=%2Fadmin");
}

if (!(await isAdmin())) {
redirect("/");
}

return ( <main className="min-h-screen bg-[#f5f7f1] text-[#26351f]"> <header className="border-b border-green-100 bg-white"> <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6"> <Link href="/admin" className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-800"> <Leaf size={25} /> </div>

```
        <div>
          <p className="text-lg font-black">Farmer2Family</p>
          <p className="text-xs text-gray-500">Administration</p>
        </div>
      </Link>

      <Link
        href="/"
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
      >
        View website
      </Link>
    </div>
  </header>

  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
      Admin workspace
    </p>

    <h1 className="mt-2 text-3xl font-black sm:text-4xl">
      Welcome to your dashboard
    </h1>

    <p className="mt-3 max-w-2xl text-gray-600">
      Manage products, customer orders, and farm visit registrations
      from one place.
    </p>

    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => {
        const Icon = section.icon;

        return (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e7] text-green-800">
                <Icon size={27} />
              </div>

              <ArrowRight
                size={22}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
              />
            </div>

            <h2 className="mt-6 text-xl font-bold">
              {section.title}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {section.description}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 font-bold text-green-800">
              Open section
              <ArrowRight size={16} />
            </span>
          </Link>
        );
      })}
    </div>

    <div className="mt-8 rounded-2xl bg-[#28551f] p-6 text-white sm:p-8">
      <div className="flex items-center gap-3">
        <ClipboardList size={25} />
        <h2 className="text-lg font-bold">Admin workspace</h2>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
        Changes to products, order statuses, and delivery estimates
        should be reflected in the public storefront and customer
        order-tracking pages.
      </p>
    </div>
  </div>
</main>


);
}
