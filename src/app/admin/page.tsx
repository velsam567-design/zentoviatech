import Link from "next/link";

const cards = [
  {
    title: "Hero CMS",
    icon: "🏠",
    desc: "Manage homepage hero section",
    href: "/admin/hero",
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Services",
    icon: "🛠️",
    desc: "Manage services",
    href: "/admin/services",
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Portfolio",
    icon: "🖼️",
    desc: "Manage portfolio projects",
    href: "/admin/portfolio",
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "Team",
    icon: "👥",
    desc: "Manage team members",
    href: "/admin/team",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Contact",
    icon: "📞",
    desc: "Company contact information",
    href: "/admin/contact",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Leads",
    icon: "📨",
    desc: "Customer enquiries",
    href: "/admin/leads",
    color: "from-yellow-500 to-amber-600",
  },
  {
    title: "Settings",
    icon: "⚙️",
    desc: "Website settings",
    href: "/admin/settings",
    color: "from-slate-600 to-slate-800",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">

      {/* Header */}

      <div>
        <h1 className="text-5xl font-bold text-cyan-400">
          Zentovia Tech CMS
        </h1>

        <p className="mt-3 text-slate-400">
          Welcome back! Manage your website from one place.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Services</p>
          <h2 className="mt-3 text-4xl font-bold text-white">6</h2>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Projects</p>
          <h2 className="mt-3 text-4xl font-bold text-white">0</h2>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Team</p>
          <h2 className="mt-3 text-4xl font-bold text-white">0</h2>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-slate-400">Leads</p>
          <h2 className="mt-3 text-4xl font-bold text-white">0</h2>
        </div>

      </div>

      {/* CMS Cards */}

      <div>

        <h2 className="text-3xl font-bold text-white mb-8">
          CMS Modules
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {cards.map((card) => (

            <Link
              key={card.title}
              href={card.href}
              className="group"
            >

              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 transition hover:-translate-y-2 hover:border-cyan-400">

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-3xl`}
                >
                  {card.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {card.title}
                </h3>

                <p className="mt-3 text-slate-400">
                  {card.desc}
                </p>

                <div className="mt-8 text-cyan-400 font-semibold group-hover:translate-x-2 transition">
                  Open Module →
                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

      {/* System Status */}

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold text-white mb-6">
          System Status
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="flex items-center gap-3">
            <span className="text-green-400 text-xl">●</span>
            <span>Firebase Connected</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-400 text-xl">●</span>
            <span>Firestore Connected</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-green-400 text-xl">●</span>
            <span>Website Online</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-yellow-400 text-xl">●</span>
            <span>Cloudinary Pending</span>
          </div>

        </div>

      </div>

    </div>
  );
}