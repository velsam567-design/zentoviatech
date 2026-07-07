import {
  ShieldCheck,
  Zap,
  Cpu,
  Cloud,
  Headphones,
  Rocket,
} from "lucide-react";

import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

const features = [
  {
    icon: Rocket,
    title: "Fast Delivery",
    description:
      "Efficient development process with on-time delivery and continuous progress updates.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Solutions",
    description:
      "Built with modern security practices to keep your business and customer data protected.",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    description:
      "Using Next.js, Flutter, Firebase, AI and the latest frameworks for future-ready applications.",
  },
  {
    icon: Cloud,
    title: "Cloud Ready",
    description:
      "Scalable cloud architecture that grows with your business without performance issues.",
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Optimized applications with excellent speed, SEO and user experience.",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description:
      "Reliable maintenance, updates and technical support after your project goes live.",
  },
];

export default function WhyChoose() {
  return (
    <section
      id="why-choose"
      className="relative overflow-hidden bg-slate-900 py-28"
    >
      {/* Background Glow */}

      <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[140px]" />

      <Container>

        <SectionTitle
          subtitle="WHY CHOOSE US"
          title="Why Businesses Choose Zentovia Tech"
          description="We combine modern technology, business understanding and long-term support to deliver software that creates real value."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_20px_60px_rgba(6,182,212,.18)]"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">

                  <Icon size={30} className="text-white" />

                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </Container>
    </section>
  );
}