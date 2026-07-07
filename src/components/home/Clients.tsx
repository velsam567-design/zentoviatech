export default function Clients() {
  const technologies = [
    "Next.js",
    "React",
    "Flutter",
    "Firebase",
    "Node.js",
    "TypeScript",
    "Cloudinary",
    "AI Solutions",
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900 py-12">
      <div className="container mx-auto max-w-7xl px-6 lg:px-10">

        <p className="mb-10 text-center text-sm font-semibold uppercase tracking-[5px] text-slate-400">
          Technologies We Work With
        </p>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8">

          {technologies.map((tech) => (
            <div
              key={tech}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-6 text-center font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              {tech}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}