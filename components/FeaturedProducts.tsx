import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "./ProductCard";
import {
  ArrowRight,
  Leaf,
  Sparkles,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";

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
      .limit(8)
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
      unit: product.unit || "unit",
      image: product.image || "",
    }));
  } catch (error) {
    console.error("Failed to load featured products:", error);
  }

  return (
    <section className="relative overflow-hidden bg-[#fafaf7] py-12 sm:py-16 lg:py-20">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#e5ecd9]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#f5e7d3]/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dce7d5] bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-[#527345]">
              <Sparkles size={15} className="text-[#d7862c]" />
              CUSTOMER FAVOURITES
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#26351f] sm:text-4xl lg:text-5xl">
              Fresh picks for{" "}
              <span className="text-[#d7862c]">your family.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              Discover fresh produce and everyday essentials selected for
              your kitchen. Add your favourites to the cart and shop with
              confidence.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#28551f] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1e4018]"
          >
            Shop all products
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Trust highlights */}
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-y border-[#e4e8dc] py-4 text-xs font-medium text-[#596b50] sm:mt-9 sm:gap-x-8 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <Leaf size={17} className="text-[#28551f]" />
            Carefully selected
          </span>

          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={17} className="text-[#28551f]" />
            Quality-focused selection
          </span>

          <span className="inline-flex items-center gap-2">
            <ShoppingBasket size={17} className="text-[#d7862c]" />
            Easy add-to-cart shopping
          </span>
        </div>

        {/* Product section heading */}
        <div className="mb-5 mt-8 flex items-end justify-between gap-3 sm:mb-7 sm:mt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#78906e]">
              Picked for you
            </p>

            <h3 className="mt-1 text-xl font-extrabold text-[#26351f] sm:text-2xl">
              Featured products
            </h3>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {products.length > 0
                ? `${products.length} products to explore`
                : "Our collection is being prepared"}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#28551f] transition hover:text-[#d7862c] sm:text-sm"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#e5e9df] bg-white px-5 py-12 text-center sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef4e8] text-[#28551f]">
              <Leaf size={30} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#26351f]">
              Fresh picks are coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We are preparing our featured collection. Browse our full
              catalogue to discover the products currently available.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#28551f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1e4018]"
            >
              Explore all products
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {/* Bottom call to action */}
        {products.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#dfe8d7] bg-[#eef4e8] sm:mt-12">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#28551f] shadow-sm">
                  <Leaf size={23} />
                </div>

                <div>
                  <h3 className="font-extrabold text-[#28551f]">
                    Bring home something fresh.
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Explore more products for your everyday needs.
                  </p>
                </div>
              </div>

              <Link
                href="/products"
                className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-[#28551f] bg-white px-5 py-3 text-sm font-bold text-[#28551f] transition hover:bg-[#28551f] hover:text-white"
              >
                Explore collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
