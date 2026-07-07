"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const COLLECTION = "site_settings";
const DOC_ID = "contact";

interface ContactData {
  company: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingHours: string;
  googleMap: string;
}

const DEFAULTS: ContactData = {
  company: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  workingHours: "",
  googleMap: "",
};

export default function AdminContactPage() {
  const [contact, setContact] = useState<ContactData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
        if (snap.exists()) {
          setContact({ ...DEFAULTS, ...(snap.data() as Partial<ContactData>) });
        }
      } catch (err) {
        console.error("Load error:", err);
        toast.error("Failed to load contact data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function set(field: keyof ContactData, value: string) {
    setContact((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    // Simple inline validation - no separate function
    if (!contact.company.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!contact.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, COLLECTION, DOC_ID), contact, { merge: true });
      toast.success("Saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Save failed. Check console.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-400 p-8">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white">Contact Section</h1>
        <p className="mt-2 text-slate-400">
          Edit the contact details shown on your website.
        </p>
      </div>

      <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-900 p-6">

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Company Name *</label>
          <input
            value={contact.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Honey Badger Technologies"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Address</label>
          <textarea
            value={contact.address}
            onChange={(e) => set("address", e.target.value)}
            rows={3}
            placeholder="123 Main Street, Salem, Tamil Nadu"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Phone *</label>
          <input
            value={contact.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 9876543210"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>
          <input
            value={contact.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="info@yourcompany.com"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Website</label>
          <input
            value={contact.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://yourcompany.com"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Working Hours</label>
          <input
            value={contact.workingHours}
            onChange={(e) => set("workingHours", e.target.value)}
            placeholder="Mon - Sat : 9:00 AM - 6:00 PM"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Google Map Embed URL
          </label>
          <input
            value={contact.googleMap}
            onChange={(e) => set("googleMap", e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
          <p className="mt-2 text-xs text-slate-500">
            Google Maps → Share → Embed a map → copy only the URL inside{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5">src="..."</code>
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}