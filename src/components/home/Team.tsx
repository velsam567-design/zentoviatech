"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { Loader2 } from "lucide-react";

const FIRESTORE_COLLECTION = "team_members";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  email: string;
  phone: string;
}

// Fallback image shown if a member has no image uploaded yet
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dcrfg8smg/image/upload/v1782703094/e2nles56bsl7zjvhkgvb.jpg";

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onSnapshot keeps this section live: whenever the admin saves changes
    // in the CMS, this listener fires again automatically — no refresh needed.
    const q = query(
      collection(db, FIRESTORE_COLLECTION),
      orderBy("updatedAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: TeamMember[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            name: d.name || "",
            position: d.position || "",
            image: d.image || "",
            email: d.email || "",
            phone: d.phone || "",
          };
        });
        setMembers(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load team members:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="team" className="bg-slate-900 py-28">
      <Container>
        <SectionTitle
          subtitle="Our Team"
          title="Meet The Experts"
          description="A passionate team dedicated to building modern software solutions for businesses."
        />

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-slate-400">
            Team members will appear here soon.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="group rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_20px_50px_rgba(6,182,212,.18)]"
              >
                {/* Avatar */}
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-cyan-500">
                  <img
                    src={member.image || DEFAULT_AVATAR}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {member.name}
                </h3>

                <p className="mt-2 font-medium text-cyan-400">
                  {member.position}
                </p>

                <p className="mt-5 leading-7 text-slate-400">
                  Experienced in delivering scalable, secure and modern
                  digital products with the latest technologies.
                </p>

                {/* Social / Contact */}
                <div className="mt-8 flex justify-center gap-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-cyan-500"
                      title={member.email}
                    >
                      ✉️
                    </a>
                  )}

                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-cyan-500"
                      title={member.phone}
                    >
                      📞
                    </a>
                  )}

                  <button className="h-10 w-10 rounded-full bg-slate-800 transition hover:bg-cyan-500">
                    🌐
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}