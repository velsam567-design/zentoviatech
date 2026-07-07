"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const FIRESTORE_COLLECTION = "portfolio";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  order: number;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onSnapshot keeps this section live: whenever the admin saves changes
    // in the CMS, this listener fires again automatically — no refresh needed.
    const q = query(
      collection(db, FIRESTORE_COLLECTION),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Project[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || "",
            category: d.category || "",
            description: d.description || "",
            image: d.image || "",
            link: d.link || "",
            order: typeof d.order === "number" ? d.order : 0,
          };
        });
        setProjects(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load portfolio:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="portfolio" className="bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="rounded-full bg-cyan-500/20 px-5 py-2 text-sm text-cyan-400">
            Our Work
          </span>
          <h1 className="mt-6 text-4xl font-black text-white">
            Featured Projects
          </h1>
          <p className="mt-4 text-slate-400">
            Explore our latest software, web, mobile and AI projects.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-3xl border border-slate-800 bg-slate-950"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="mt-12 text-center text-slate-400">
            Projects will appear here soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 transition duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_20px_50px_rgba(6,182,212,.18)]"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-8">
                  {project.category && (
                    <span className="text-sm font-medium text-cyan-400">
                      {project.category}
                    </span>
                  )}

                  <h2 className="mt-2 text-xl font-bold text-white">
                    {project.title}
                  </h2>

                  <p className="mt-3 leading-7 text-slate-400">
                    {project.description}
                  </p>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
                    >
                      View Project
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}