import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Products } from "@/components/landing/Products";
import { Security } from "@/components/landing/Security";
import { CtaSimulation } from "@/components/landing/CtaSimulation";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <CtaSimulation />
        <Security />
      </main>
      <Footer />
    </>
  );
}
