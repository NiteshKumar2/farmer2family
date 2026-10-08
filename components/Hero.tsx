import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <div className="overflow-hidden rounded-3xl bg-[#dcebd2]">
        <div className="grid min-h-[520px] items-center md:grid-cols-2">

          <div className="p-8 md:p-16">

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#6b875e]">
              FARM → FAMILY
            </p>

            <h1 className="max-w-xl text-4xl font-black leading-tight text-[#23351f] md:text-6xl">
              Fresh food.
              <br />
              Trusted farmers.
              <br />
              <span className="text-[#d7862c]">
                Happy families.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-700">
              Discover fresh and quality food sourced from farmers
              and delivered directly to your family.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-[#28551f] px-8 py-3 font-bold text-white transition hover:bg-[#1c3e17]"
              >
                Shop Now
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-[#28551f] px-8 py-3 font-bold text-[#28551f]"
              >
                Meet Farmers
              </Link>
            </div>

          </div>

          <div className="flex min-h-[400px] items-center justify-center bg-[#c6ddb9]">
            <div className="text-center">
              <div className="text-[130px]">🌾</div>

              <p className="text-xl font-bold text-[#31522a]">
                Direct from the farm
              </p>

              <p className="mt-2 text-gray-700">
                Freshness you can trust
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}