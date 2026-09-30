import Link from "next/link";
import ProductCard from "./ProductCard";

const products = [
  {
    name: "Fresh Organic Tomatoes",
    category: "Vegetables",
    price: 60,
    unit: "1 kg",
    image: "🍅",
  },
  {
    name: "Fresh Potatoes",
    category: "Vegetables",
    price: 45,
    unit: "1 kg",
    image: "🥔",
  },
  {
    name: "Organic Basmati Rice",
    category: "Rice & Grains",
    price: 180,
    unit: "1 kg",
    image: "🌾",
  },
  {
    name: "Organic Toor Dal",
    category: "Pulses",
    price: 160,
    unit: "1 kg",
    image: "🫘",
  },
  {
    name: "Cold Pressed Groundnut Oil",
    category: "Oils",
    price: 420,
    unit: "1 L",
    image: "🫙",
  },
  {
    name: "Fresh A2 Milk",
    category: "Dairy",
    price: 75,
    unit: "1 L",
    image: "🥛",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#f0f3e9] py-14">

      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-8 flex items-end justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
              Fresh picks
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Best sellers
            </h2>
          </div>

          <Link
            href="/products"
            className="font-bold text-[#28551f]"
          >
            View all →
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </div>

      </div>

    </section>
  );
}