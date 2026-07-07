"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config"; // adjust this import to your firebase config file
import { Globe, Mail, Phone, MapPin, Clock } from "lucide-react";

const FIRESTORE_COLLECTION = "site_settings";
const FIRESTORE_DOC_ID = "contact";

interface ContactData {
  company: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingHours: string;
  googleMap: string;
}

const DEFAULT_CONTACT: ContactData = {
  company: "Zentovia Tech",
  address: "Chennai, Tamil Nadu, India",
  phone: "+91 9876543210",
  email: "info@zentoviatech.com",
  website: "https://zentoviatech.com",
  workingHours: "Mon - Sat : 9:00 AM - 6:00 PM",
  googleMap: "",
};

export default function Contact() {
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onSnapshot keeps this section live: whenever the admin saves changes
    // in the CMS, this listener fires again automatically — no refresh needed.
    const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setContact({
            company: d.company ?? DEFAULT_CONTACT.company,
            address: d.address ?? DEFAULT_CONTACT.address,
            phone: d.phone ?? DEFAULT_CONTACT.phone,
            email: d.email ?? DEFAULT_CONTACT.email,
            website: d.website ?? DEFAULT_CONTACT.website,
            workingHours: d.workingHours ?? DEFAULT_CONTACT.workingHours,
            googleMap: d.googleMap ?? DEFAULT_CONTACT.googleMap,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load contact info:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="contact" className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800" />
          <div className="h-4 w-3/4 rounded bg-slate-800" />
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl font-black text-white">
          Contact {contact.company}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <MapPin size={22} className="mt-1 text-cyan-400" />
            <div>
              <p className="font-semibold text-white">Address</p>
              <p className="mt-1 text-slate-400">{contact.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <Clock size={22} className="mt-1 text-cyan-400" />
            <div>
              <p className="font-semibold text-white">Working Hours</p>
              <p className="mt-1 text-slate-400">{contact.workingHours}</p>
            </div>
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-cyan-400"
          >
            <Mail size={22} className="mt-1 text-cyan-400" />
            <div>
              <p className="font-semibold text-white">Email</p>
              <p className="mt-1 text-slate-400">{contact.email}</p>
            </div>
          </a>

          <a
            href={`tel:${contact.phone}`}
            className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-cyan-400"
          >
            <Phone size={22} className="mt-1 text-cyan-400" />
            <div>
              <p className="font-semibold text-white">Phone</p>
              <p className="mt-1 text-slate-400">{contact.phone}</p>
            </div>
          </a>
        </div>

        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
          >
            <Globe size={18} />
            {contact.website}
          </a>
        )}

        {/* IMPORTANT: googleMap must be a Google Maps EMBED url, e.g.
            https://www.google.com/maps/embed?pb=... — a normal maps.google.com
            link (the one you copy from the address bar or "Share" button)
            will not render inside an iframe. Get the embed link from
            Google Maps -> Share -> Embed a map -> copy the src URL. */}
        {contact.googleMap && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800">
            <iframe
              src={contact.googleMap}
              width="100%"
              height="350"
              loading="lazy"
              className="border-0"
              title="Location map"
            />
          </div>
        )}
      </div>
    </section>
  );
}