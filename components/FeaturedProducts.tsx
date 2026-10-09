
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "./ProductCard";
import { ArrowRight, Leaf, Sparkles, ShieldCheck } from "lucide-react";

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
    <section className="relative overflow-hidden bg-[#fafaf7] py-12 sm:py-16 lg:py-20">
      {/* Subtle decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full bg-[#e5ecd9]/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#658256]">
              <Sparkles size={17} />
              <span>LOVED BY OUR CUSTOMERS</span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#26351f] sm:text-4xl lg:text-[42px]">
              Our Bestsellers
              <span className="text-[#d7862c]">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Discover the favourites customers keep coming back for.
              Carefully selected products for your everyday needs,
              delivered with the goodness of Farmer2Family.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-[#28551f] bg-white px-5 py-3 text-sm font-bold text-[#28551f] transition hover:bg-[#28551f] hover:text-white"
          >
            View all products
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Trust highlights */}
        <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-[#e6e9df] py-4 text-xs font-medium text-[#596b50] sm:mb-8 sm:gap-x-8 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <Leaf size={17} className="text-[#28551f]" />
            Thoughtfully selected
          </span>

          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={17} className="text-[#28551f]" />
            Quality-focused selection
          </span>

          <span className="inline-flex items-center gap-2">
            <Sparkles size={16} className="text-[#d7862c]" />
            Everyday favourites
          </span>
        </div>

        {/* Bestselling products */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="min-w-0 transition duration-300 hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 text-center sm:mt-12">
              <div className="flex items-center gap-2 text-[#28551f]">
                <Leaf size={20} />
                <span className="text-sm font-semibold">
                  Good food starts with good choices.
                </span>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#28551f] underline decoration-[#b9c9ad] underline-offset-4 transition hover:text-[#d7862c]"
              >
                Explore our full collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-[#e5e9df] bg-white px-5 py-12 text-center sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4e8] text-[#28551f]">
              <Leaf size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#26351f]">
              Our bestsellers are coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We are preparing our featured collection. Explore all
              currently available products in the meantime.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#28551f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1e4018]"
            >
              Shop all products
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}