import Link from "next/link";

const categories = [
  ["🥬", "Vegetables"],
  ["🍎", "Fruits"],
  ["🌾", "Rice & Grains"],
  ["🫘", "Pulses"],
  ["🥛", "Dairy"],
  ["🫒", "Oils"],
  ["🌶️", "Spices"],
  ["🌱", "Organic Foods"],
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">

      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
          Explore
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#26351f]">
          Shop by category
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map(([icon, name]) => (
          <Link
            key={name}
            href={`/products?category=${encodeURIComponent(name)}`}
            className="group rounded-2xl border bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-5xl transition group-hover:scale-110">
              {icon}
            </div>

            <p className="mt-4 text-sm font-bold">
              {name}
            </p>
          </Link>
        ))}
      </div>

    </section>
  );
}