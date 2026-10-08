import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find({
    active: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  const safeProducts = products.map((product) => ({
    name: product.name,
    category: product.category,
    price: product.salePrice ?? product.price,
    unit: product.unit,
    image: product.image,
  }));

  return (
    <>
      <Header />

      <h1 className="mt-2 text-4xl font-black text-[#26351f]">
        Fresh Products
      </h1>

      <p className="mt-3 text-gray-600">
        Quality products sourced from trusted farmers.
      </p>

      {safeProducts.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-gray-500">No products available.</p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-[#28551f] px-6 py-3 font-bold text-white"
          >
            Go Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {safeProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      )}
      <Footer />
    </>
  );
}
