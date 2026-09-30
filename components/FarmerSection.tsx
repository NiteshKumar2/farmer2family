import Link from "next/link";

export default function FarmerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">

      <div className="grid items-center gap-10 md:grid-cols-2">

        <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-[#dcebd2]">
          <div className="text-center">
            <div className="text-9xl">👨‍🌾</div>

            <p className="mt-5 text-xl font-bold">
              Our farming community
            </p>
          </div>
        </div>

        <div>

          <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
            Our mission
          </p>

          <h2 className="mt-3 text-4xl font-black leading-tight">
            Connecting farmers with families.
          </h2>

          <p className="mt-6 leading-8 text-gray-600">
            Farmer2Family creates a direct connection between
            farmers and customers. Our goal is to make quality
            food accessible while creating better opportunities
            for farming communities.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6">

            <div>
              <p className="text-3xl font-black text-[#28551f]">
                1000+
              </p>
              <p className="text-sm text-gray-500">
                Farmers
              </p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#28551f]">
                10K+
              </p>
              <p className="text-sm text-gray-500">
                Families
              </p>
            </div>

          </div>

          <Link
            href="/farmers"
            className="mt-8 inline-block rounded-full bg-[#28551f] px-7 py-3 font-bold text-white"
          >
            Meet Our Farmers →
          </Link>

        </div>

      </div>

    </section>
  );
}