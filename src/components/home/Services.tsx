"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";

const FIRESTORE_COLLECTION = "services";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, FIRESTORE_COLLECTION),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Service[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || "",
            description: d.description || "",
            icon: d.icon || "",
            order: typeof d.order === "number" ? d.order : 0,
          };
        });
        setServices(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load services:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="services" className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-cyan-500/20 px-5 py-2 text-sm text-cyan-400">
            Our Services
          </span>
          <h2 className="mt-6 text-4xl font-black text-white">
            What We Offer
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-3xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="mt-12 text-center text-slate-400">
            Services will appear here soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_20px_50px_rgba(6,182,212,.18)]"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  {service.icon.startsWith("http") ? (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : service.icon ? (
                    <span className="text-3xl">{service.icon}</span>
                  ) : (
                    <span className="text-3xl">💻</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-bold text-white">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-3 leading-7 text-slate-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}