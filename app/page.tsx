import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import FarmerSection from "@/components/FarmerSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="bg-[#fafaf7] text-[#26351f]">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <FarmerSection />
      </main>

      <Footer />
    </>
  );
}