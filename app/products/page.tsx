import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Leaf,
  ShoppingBag,
  ArrowRight,
  SlidersHorizontal,
  Sprout,
  Truck,
} from "lucide-react";

export const dynamic = "force-dynamic";

const categories = [
  "All Products",
  "Vegetables",
  "Fruits",
  "Rice & Grains",
  "Pulses",
  "Dairy",
  "Oils",
  "Spices",
  "Organic Foods",
];

const sortOptions = [
  { label: "Newest arrivals", value: "newest" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const requestedCategory = params.category?.trim() ?? "";
  const selectedCategory =
    categories.includes(requestedCategory) &&
    requestedCategory !== "All Products"
      ? requestedCategory
      : "";

  const sort = sortOptions.some((option) => option.value === params.sort)
    ? params.sort!
    : "newest";

  await connectDB();

  const filter: Record<string, unknown> = {
    active: true,
  };

  if (selectedCategory) {
    filter.category = selectedCategory;
  }

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { category: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }
  const sortQuery: Record<string, 1 | -1> =
    sort === "name-asc"
      ? { name: 1 }
      : sort === "price-asc"
        ? { price: 1 }
        : sort === "price-desc"
          ? { price: -1 }
          : { createdAt: -1 };

  const products = await Product.find(filter).sort(sortQuery).lean();

  const safeProducts = products.map((product) => ({
    _id: String(product._id),
    name: product.name,
    category: product.category,
    price: product.salePrice ?? product.price,
    unit: product.unit,
    image: product.image,
  }));

  const hasFilters = Boolean(search || selectedCategory);
  const activeSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ??
    "Newest arrivals";

  function buildHref(
    overrides: {
      category?: string;
      search?: string;
      sort?: string;
    } = {},
  ) {
    const query = new URLSearchParams();

    const nextCategory =
      overrides.category !== undefined ? overrides.category : selectedCategory;

    const nextSearch =
      overrides.search !== undefined ? overrides.search : search;

    const nextSort = overrides.sort !== undefined ? overrides.sort : sort;

    if (nextCategory && nextCategory !== "All Products") {
      query.set("category", nextCategory);
    }

    if (nextSearch) {
      query.set("search", nextSearch);
    }

    if (nextSort && nextSort !== "newest") {
      query.set("sort", nextSort);
    }

    const queryString = query.toString();
    return queryString ? `/products?${queryString}` : "/products";
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#fafaf7] text-[#26351f]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#eef4e8]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#dce9d0] opacity-70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white opacity-70 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-6 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e5cd] bg-white/80 px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#527345]">
                <Leaf size={15} />
                FRESH FROM OUR FARMS
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Good food.
                <br />
                <span className="text-[#d7862c]">Better living.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                Shop fresh vegetables, seasonal fruits, grains, and everyday
                essentials. Find the goodness your family deserves, all in one
                place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#product-list"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#28551f] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1e4018]"
                >
                  Explore Products
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-[#cad9c1] bg-white/80 px-6 py-3.5 text-sm font-bold text-[#28551f] transition hover:bg-white"
                >
                  Back to Home
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#527345]">
                <span className="inline-flex items-center gap-2">
                  <Sprout size={17} />
                  Farm-fresh selection
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShoppingBag size={17} />
                  Everyday essentials
                </span>
                <span className="inline-flex items-center gap-2">
                  <Truck size={17} />
                  Convenient shopping
                </span>
              </div>
            </div>

            <div className="hidden lg:flex lg:justify-end">
              <div className="flex h-64 w-64 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-sm">
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-[#dfead5]">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-sm">
                    <Sprout
                      size={76}
                      strokeWidth={1.4}
                      className="text-[#28551f]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section
          id="product-list"
          className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-6"
        >
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-sm text-gray-500"
          >
            <Link href="/" className="transition hover:text-[#28551f]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#26351f]">Products</span>
          </nav>

          {/* Search */}
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <form
              action="/products"
              method="GET"
              className="flex flex-col gap-3 sm:flex-row"
            >
              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}

              {sort !== "newest" && (
                <input type="hidden" name="sort" value={sort} />
              )}

              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Search vegetables, fruits, grains..."
                  aria-label="Search products"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-[#fafaf7] pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#28551f] focus:ring-2 focus:ring-[#28551f]/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#28551f] px-7 text-sm font-bold text-white transition hover:bg-[#1e4018]"
              >
                <Search size={17} />
                Search
              </button>
            </form>
          </div>

          {/* Categories */}
          <div className="mb-9">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">Shop by Category</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Find what you need, faster.
                </p>
              </div>
            </div>

            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0">
              {categories.map((category) => {
                const active =
                  category === "All Products"
                    ? !selectedCategory
                    : selectedCategory === category;

                return (
                  <Link
                    key={category}
                    href={buildHref({ category })}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "border-[#28551f] bg-[#28551f] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#28551f] hover:text-[#28551f]"
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Results heading and sorting */}
          <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#7a906e]">
                Your fresh picks
              </p>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {search
                  ? `Results for "${search}"`
                  : selectedCategory || "All Products"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {safeProducts.length}{" "}
                {safeProducts.length === 1 ? "product" : "products"} found
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <SlidersHorizontal size={17} />
                <span>Sort by:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={buildHref({ sort: option.value })}
                    aria-current={sort === option.value ? "true" : undefined}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                      sort === option.value
                        ? "border-[#28551f] bg-[#eef4e8] text-[#28551f]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#28551f] hover:text-[#28551f]"
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-500">Active filters:</span>

              {search && (
                <span className="rounded-full bg-[#eef4e8] px-3 py-1.5 font-medium text-[#28551f]">
                  Search: {search}
                </span>
              )}

              {selectedCategory && (
                <span className="rounded-full bg-[#eef4e8] px-3 py-1.5 font-medium text-[#28551f]">
                  {selectedCategory}
                </span>
              )}

              <Link
                href="/products"
                className="ml-1 font-semibold text-[#b86c1d] underline underline-offset-4 hover:text-[#28551f]"
              >
                Clear all
              </Link>
            </div>
          )}

          {/* Product grid or empty state */}
          {safeProducts.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-5 py-14 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef4e8] text-[#28551f]">
                {search ? <Search size={28} /> : <ShoppingBag size={28} />}
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                {search || selectedCategory
                  ? "No matching products found"
                  : "Our shelves are getting ready"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                {search || selectedCategory
                  ? "Try a different search term or category to discover more products."
                  : "We are preparing our product selection. Please check back soon."}
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#28551f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1e4018]"
              >
                Browse All Products
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {safeProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Bottom note */}
          {safeProducts.length > 0 && (
            <div className="mt-10 rounded-2xl border border-[#e3eadc] bg-[#f2f6ed] px-5 py-5 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Leaf size={22} className="mt-0.5 shrink-0 text-[#28551f]" />
                <div>
                  <p className="font-bold text-[#28551f]">
                    Good choices start with good food.
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Explore our selection and find everyday essentials for your
                    family.
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#28551f] hover:text-[#d7862c] sm:mt-0"
              >
                Explore Farmer2Family
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
