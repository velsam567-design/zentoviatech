import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

import {
  Search,
  ClipboardList,
  Code2,
  ShieldCheck,
  Rocket,
  LifeBuoy,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Discovery",
    description:
      "We understand your business, goals, target audience and project requirements.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Planning",
    description:
      "We prepare the architecture, UI/UX design, timeline and development roadmap.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Development",
    description:
      "Our developers build scalable websites, ERP systems and mobile applications.",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Testing",
    description:
      "Every feature is tested for quality, security and performance before launch.",
  },
  {
    icon: Rocket,
    step: "05",
    title: "Deployment",
    description:
      "We deploy your application securely with cloud hosting and production setup.",
  },
  {
    icon: LifeBuoy,
    step: "06",
    title: "Support",
    description:
      "Continuous maintenance, updates and technical support after delivery.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute right-0 bottom-20 h-72 w-72 rounded-full bg-blue-600/10 blur-[140px]" />

      <Container>

        <SectionTitle
          subtitle="OUR PROCESS"
          title="How We Turn Ideas Into Products"
          description="A structured development process that ensures quality, transparency and successful project delivery."
        />

        <div className="relative mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {steps.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_20px_60px_rgba(6,182,212,.18)]"
              >
                {/* Step Number */}

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">

                    <Icon size={30} className="text-white" />

                  </div>

                  <span className="text-4xl font-black text-slate-700">
                    {item.step}
                  </span>

                </div>

                <h3 className="text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </Container>
    </section>
  );
}