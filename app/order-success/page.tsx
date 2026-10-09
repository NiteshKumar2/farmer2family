
import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafaf7] px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#e3eadc] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef4e8] text-3xl text-[#28551f]">
          ✓
        </div>

        <h1 className="mt-5 text-2xl font-black text-[#26351f]">
          Order placed successfully!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for shopping with Farmer2Family.
          Your payment method is Cash on Delivery.
        </p>

        {orderId && (
          <p className="mt-4 break-all text-sm text-gray-500">
            Order ID: {orderId}
          </p>
        )}

        <Link
          href="/products"
          className="mt-7 inline-flex rounded-full bg-[#28551f] px-6 py-3 font-bold text-white hover:bg-[#1e4018]"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}