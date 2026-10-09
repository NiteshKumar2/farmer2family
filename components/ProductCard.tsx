"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, Leaf, ArrowRight, ImageOff } from "lucide-react";

type Product = {
  _id?: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  unit: string;
  image?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const imageValue = product.image?.trim() ?? "";

  const isImageUrl =
    imageValue.startsWith("data:image/") ||
    /^https?:\/\//i.test(imageValue) ||
    imageValue.startsWith("/");

  const hasImage = isImageUrl && !imageFailed;

  const hasDiscount =
    typeof product.salePrice === "number" &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const displayPrice = hasDiscount ? product.salePrice! : product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const productHref = product._id ? `/products/${product._id}` : "/products";
  const { addToCart } = useCart();

  function handleAddToCart() {
    if (!product._id) return;

    addToCart({
      _id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.image ?? undefined,
      unit: product.unit,
    });
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#dce7d5] hover:shadow-xl">
      {/* Product image */}
      <div className="relative overflow-hidden bg-[#f3f5ec]">
        <Link
          href={productHref}
          aria-label={`View ${product.name}`}
          className="relative flex aspect-square items-center justify-center overflow-hidden"
        >
          {hasImage ? (
            <img
              src={imageValue}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-5"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              {imageValue && !isImageUrl ? (
                <span
                  className="text-6xl sm:text-7xl"
                  role="img"
                  aria-label={product.name}
                >
                  {imageValue}
                </span>
              ) : (
                <>
                  <ImageOff
                    size={36}
                    strokeWidth={1.3}
                    className="text-[#9aaa8d]"
                  />
                  <span className="text-xs text-gray-500">
                    Image unavailable
                  </span>
                </>
              )}
            </div>
          )}

          {/* Category */}
          <span className="absolute left-2 top-2 max-w-[70%] truncate rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#28551f] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            {product.category}
          </span>

          {/* Discount */}
          {hasDiscount && (
            <span className="absolute right-2 top-2 rounded-full bg-[#d7862c] px-2 py-1 text-[10px] font-extrabold text-white shadow-sm sm:right-3 sm:top-3 sm:text-xs">
              {discountPercentage}% OFF
            </span>
          )}
        </Link>

        {/* Favorite button */}
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((previous) => !previous)}
          className={`absolute right-2 top-11 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition sm:right-3 sm:top-14 sm:h-10 sm:w-10 ${
            isFavorite
              ? "bg-red-50 text-red-500"
              : "bg-white/95 text-gray-600 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart size={18} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#78906c] sm:text-xs">
          <Leaf size={12} />
          {product.category}
        </p>

        <Link href={productHref} className="mt-1">
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-gray-900 transition-colors group-hover:text-[#28551f] sm:min-h-12 sm:text-base sm:leading-6">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-gray-500">
          Per {product.unit || "unit"}
        </p>

        <div className="mt-auto pt-4">
          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-lg font-black text-[#28551f] sm:text-xl">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Product action */}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#28551f] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#1c3e17] sm:text-sm"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>

            <Link
              href={productHref}
              aria-label={`View ${product.name}`}
              className="flex items-center justify-center rounded-xl border border-[#28551f]/20 px-3 py-2.5 text-[#28551f] transition hover:bg-[#eef4e8]"
            >
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
