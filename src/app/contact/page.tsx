"use client";

import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { Globe, Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "@/firebase/config";
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
  company: "Honey Badger Technologies",
  address: "Chennai, Tamil Nadu, India",
  phone: "+91 9876543210",
  email: "info@honeybadgertech.com",
  website: "https://honeybadgertech.com",
  workingHours: "Mon - Sat : 9:00 AM - 6:00 PM",
  googleMap: "",
};

export default function ContactPage() {
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔥 Live contact info from Firestore — admin saves reflect here instantly
  useEffect(() => {
    const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setContact({
            ...DEFAULT_CONTACT,
            ...(snap.data() as Partial<ContactData>),
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message");
      return;
    }

    setSubmitting(true);
    try {
      // Writes into the same "leads" collection your Admin Leads page reads from
      await addDoc(collection(db, "leads"), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: "",
        service: "",
        message: message.trim(),
        status: "New",
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-800" />
          <div className="h-4 w-3/4 rounded bg-slate-800" />
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-white md:text-5xl">
          Contact {contact.company}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Have a project in mind? Send us a message and our team will get
          back to you shortly.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Left: contact details + map */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard icon={<MapPin size={20} />} label="Address">
                {contact.address}
              </InfoCard>

              <InfoCard icon={<Clock size={20} />} label="Working Hours">
                {contact.workingHours}
              </InfoCard>

              <a href={`mailto:${contact.email}`} className="block">
                <InfoCard icon={<Mail size={20} />} label="Email" hoverable>
                  {contact.email}
                </InfoCard>
              </a>

              <a href={`tel:${contact.phone}`} className="block">
                <InfoCard icon={<Phone size={20} />} label="Phone" hoverable>
                  {contact.phone}
                </InfoCard>
              </a>
            </div>

            {contact.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
              >
                <Globe size={18} />
                {contact.website}
              </a>
            )}

            {contact.googleMap && (
              <div className="overflow-hidden rounded-3xl border border-slate-800">
                <iframe
                  src={contact.googleMap}
                  width="100%"
                  height="320"
                  loading="lazy"
                  className="border-0"
                  title="Location map"
                />
              </div>
            )}
          </div>

          {/* Right: contact form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-white/10 bg-slate-900 p-6"
          >
            <h2 className="text-xl font-bold text-white">Send a Message</h2>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  children,
  hoverable = false,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  hoverable?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 ${
        hoverable ? "transition hover:border-cyan-400" : ""
      }`}
    >
      <span className="mt-1 text-cyan-400">{icon}</span>
      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{children}</p>
      </div>
    </div>
  );
}