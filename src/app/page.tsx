import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import Clients from "@/components/home/Clients";
import Services from "@/components/home/Services";
import WhyChoose from "@/components/home/WhyChoose";
import Portfolio from "@/components/home/Portfolio";
import Process from "@/components/home/Process";
import Team from "@/components/home/Team";
import Contact from "@/components/home/Contact";

// Uncomment once these components are created:
// import Stats from "@/components/home/Stats";
// import Testimonials from "@/components/home/Testimonials";
// import Technologies from "@/components/home/Technologies";
// import Pricing from "@/components/home/Pricing";
// import FAQ from "@/components/home/FAQ";
// import CTA from "@/components/home/CTA";

// This overrides the layout's default title/description for the home route only.
// Keep in sync with layout.tsx's default if you change it.
export const metadata: Metadata = {
  title: "Zentovia Tech — Premium Software Development",
  description:
    "Zentovia Tech builds premium websites, ERP software, mobile applications, AI solutions, cloud platforms and enterprise digital products.",
};

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden">
        <Hero />
        <Clients />

        {/* <Stats /> */}

        <Services />
        <WhyChoose />
        <Portfolio />

        {/* <Testimonials /> */}
        {/* <Technologies /> */}
        {/* <Pricing /> */}

        <Process />

        {/* <FAQ /> */}
        {/* <CTA /> */}

        <Team />
        <Contact />
      </main>

      <Footer />
    </>
  );
}