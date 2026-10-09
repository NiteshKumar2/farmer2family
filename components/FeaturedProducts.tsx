import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "./ProductCard";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";

type FeaturedProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  unit: string;
  image: string;
};

export default async function FeaturedProducts() {
  let products: FeaturedProduct[] = [];

  try {
    await connectDB();

    const dbProducts = await Product.find({
      active: true,
      featured: true,
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    products = dbProducts.map((product) => ({
      _id: String(product._id),
      name: product.name,
      category: product.category,
      price: Number(product.price),
      salePrice:
        product.salePrice != null
          ? Number(product.salePrice)
          : undefined,
      unit: product.unit,
      image: product.image || "",
    }));
  } catch (error) {
    console.error("Failed to load featured products:", error);
  }

  return (
    <section className="relative overflow-hidden bg-[#f0f3e9] py-12 sm:py-16 lg:py-20">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d7862c]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#28551f]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7862c]/20 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#bd7020] sm:text-sm">
              <Sparkles size={15} />
              Fresh from the farm
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-[#26351f] sm:text-3xl lg:text-4xl">
              Our Featured Products
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Discover farm-fresh produce and everyday essentials,
              carefully selected to bring quality and freshness to your
              family.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#28551f]/20 bg-white px-3 py-2.5 text-xs font-bold text-[#28551f] shadow-sm transition-all duration-300 hover:border-[#28551f] hover:bg-[#28551f] hover:text-white sm:px-5 sm:text-sm"
          >
            <span className="hidden sm:inline">View all products</span>
            <span className="sm:hidden">View all</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="min-w-0 transition-transform duration-300 hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#52664a] sm:mt-10">
              <Leaf size={17} className="text-[#28551f]" />
              <span>Good food, fresh from trusted sources.</span>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-[#dfe7d6] bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef4e8] text-[#28551f]">
              <Leaf size={30} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#26351f] sm:text-2xl">
              Fresh picks are coming soon!
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              We&apos;re preparing our selection of fresh products.
              Explore our collection to discover what&apos;s available.
            </p>

            <Link
              href="/products"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#28551f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#1e4018] hover:shadow-md"
            >
              Browse all products
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
