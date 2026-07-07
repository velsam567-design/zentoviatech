"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const SERVICE_OPTIONS = [
  "Website Design",
  "Web Application",
  "Mobile App Development",
  "ERP / Billing Software",
  "E-Commerce Store",
  "SEO & Digital Marketing",
  "Other",
];

const BUDGET_OPTIONS = [
  "Under ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "Above ₹1,00,000",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GetQuotePage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) {
      toast.error("Valid email is required");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!form.service) {
      toast.error("Please select a service");
      return false;
    }
    if (!form.budget) {
      toast.error("Please select a budget range");
      return false;
    }
    if (!form.message.trim()) {
      toast.error("Please describe your project");
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "leads"), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        budget: form.budget,
        message: form.message.trim(),
        company: "",
        status: "New",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- SUCCESS STATE ----------
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-24">
        <div className="max-w-md text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-black text-white">
            Quote Request Sent!
          </h1>
          <p className="mt-3 text-slate-400">
            Thank you! We've received your request and will get back to you
            within 24 hours.
          </p>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setSubmitted(false);
            }}
            className="mt-8 rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Submit Another Request
          </button>
        </div>
      </main>
    );
  }

  // ---------- FORM ----------
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-2xl">

        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-cyan-500/20 px-5 py-2 text-sm text-cyan-400">
            Free Consultation
          </span>
          <h1 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Get a Quote
          </h1>
          <p className="mt-4 text-slate-400">
            Tell us about your project and we'll get back to you with a
            detailed proposal within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-12 space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-8">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Phone *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Service Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Service Type *
            </label>
            <div className="flex flex-wrap gap-3">
              {SERVICE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => set("service", option)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    form.service === option
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                      : "border-white/10 bg-slate-800 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Budget Range *
            </label>
            <div className="flex flex-wrap gap-3">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => set("budget", option)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    form.budget === option
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                      : "border-white/10 bg-slate-800 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Project Details *
            </label>
            <textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={5}
              placeholder="Describe your project, goals, timeline, or any specific requirements..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>

          <p className="text-center text-xs text-slate-500">
            We'll respond within 24 hours. No spam, ever.
          </p>
        </div>
      </div>
    </main>
  );
}