"use client";

import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast"; // npm install react-hot-toast, and render <Toaster /> once in your root layout

const FIRESTORE_COLLECTION = "site_settings";
const FIRESTORE_DOC_ID = "hero";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  mainImage: string;
  image1: string; // Website UI
  image2: string; // Mobile App
  image3: string; // ERP Dashboard
  image4: string; // AI Dashboard
  image5: string; // Cloud Platform
  image6: string; // Analytics Dashboard
  showBadge: boolean;
  showButtons: boolean;
}

const DEFAULT_HERO: HeroData = {
  badge: "",
  title: "",
  subtitle: "",
  description: "",
  button1Text: "",
  button1Link: "/contact",
  button2Text: "",
  button2Link: "/portfolio",
  mainImage: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
  image5: "",
  image6: "",
  showBadge: true,
  showButtons: true,
};

// Config for the 7 image upload slots shown in the admin form.
// "field" maps to the HeroData key, "label" is the form/preview label.
const IMAGE_SLOTS: { field: keyof HeroData; label: string; helper: string }[] = [
  {
    field: "mainImage",
    label: "Main Hero Image",
    helper: "The large centerpiece image (laptop / product shot).",
  },
  {
    field: "image1",
    label: "Website Screenshot",
    helper: "Small floating image — bottom left.",
  },
  {
    field: "image2",
    label: "Mobile App Screenshot",
    helper: "Small floating image — top left.",
  },
  {
    field: "image3",
    label: "ERP Dashboard",
    helper: "Small floating image — top right.",
  },
  {
    field: "image4",
    label: "AI Dashboard",
    helper: "Small floating image — top center.",
  },
  {
    field: "image5",
    label: "Cloud Platform",
    helper: "Small floating image — bottom right.",
  },
  {
    field: "image6",
    label: "Analytics Dashboard",
    helper: "Small floating image — bottom center.",
  },
];

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Tracks which image field is currently uploading, e.g. "mainImage" or "image3"
  const [uploadingField, setUploadingField] = useState<keyof HeroData | null>(
    null
  );

  // Live-load current hero content so the form always reflects Firestore
  useEffect(() => {
    const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setHero({ ...DEFAULT_HERO, ...(snap.data() as Partial<HeroData>) });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load hero settings:", error);
        toast.error("Failed to load hero settings");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function handleChange<K extends keyof HeroData>(field: K, value: HeroData[K]) {
    setHero((prev) => ({ ...prev, [field]: value }));
  }

  // Upload a file to Cloudinary and store the returned URL under the given field
  async function handleImageUpload(field: keyof HeroData, file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploadingField(field);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary upload error:", data);
        throw new Error(data?.error?.message || "Upload failed");
      }

      handleChange(field, data.secure_url as HeroData[typeof field]);
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setUploadingField(null);
    }
  }

  function removeImage(field: keyof HeroData) {
    handleChange(field, "" as HeroData[typeof field]);
  }

  function validate(): boolean {
    if (!hero.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!hero.subtitle.trim()) {
      toast.error("Subtitle is required");
      return false;
    }
    return true;
  }

  async function handleSave() {
    if (!validate()) return;

    setSaving(true);
    try {
      // merge: true keeps any fields not managed by this form intact,
      // instead of wiping the whole document on every save.
      await setDoc(doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID), hero, {
        merge: true,
      });
      toast.success("Hero section updated successfully");
    } catch (error) {
      console.error("Failed to save hero section:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-400">Loading hero settings...</p>;
  }

  const isUploading = uploadingField !== null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ---------- FORM ---------- */}
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white">Hero Section</h1>
          <p className="mt-2 text-slate-400">
            Edit the content shown at the top of your homepage.
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <Toggle
            label="Show Badge"
            checked={hero.showBadge}
            onChange={(v) => handleChange("showBadge", v)}
          />
          <Field
            label="Badge Text"
            value={hero.badge}
            onChange={(v) => handleChange("badge", v)}
          />
          <Field
            label="Title *"
            value={hero.title}
            onChange={(v) => handleChange("title", v)}
          />
          <Field
            label="Subtitle *"
            value={hero.subtitle}
            onChange={(v) => handleChange("subtitle", v)}
          />
          <Field
            label="Description"
            value={hero.description}
            onChange={(v) => handleChange("description", v)}
            textarea
          />

          <Toggle
            label="Show Buttons"
            checked={hero.showButtons}
            onChange={(v) => handleChange("showButtons", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Button 1 Text"
              value={hero.button1Text}
              onChange={(v) => handleChange("button1Text", v)}
            />
            <Field
              label="Button 1 Link"
              value={hero.button1Link}
              onChange={(v) => handleChange("button1Link", v)}
              placeholder="/contact"
            />
            <Field
              label="Button 2 Text"
              value={hero.button2Text}
              onChange={(v) => handleChange("button2Text", v)}
            />
            <Field
              label="Button 2 Link"
              value={hero.button2Link}
              onChange={(v) => handleChange("button2Link", v)}
              placeholder="/portfolio"
            />
          </div>

          {/* Image uploads: main hero image + 6 floating satellite images */}
          <div className="space-y-5 border-t border-white/10 pt-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Hero Images
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Upload the main image plus up to 6 small floating images
                shown around it.
              </p>
            </div>

            {IMAGE_SLOTS.map((slot) => (
              <ImageUploadField
                key={slot.field}
                label={slot.label}
                helper={slot.helper}
                value={hero[slot.field] as string}
                uploading={uploadingField === slot.field}
                disabled={isUploading}
                onUpload={(file) => handleImageUpload(slot.field, file)}
                onRemove={() => removeImage(slot.field)}
              />
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || isUploading}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ---------- LIVE PREVIEW ---------- */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Live Preview
        </p>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-8">
          {hero.showBadge && hero.badge && (
            <span className="inline-block rounded-full bg-cyan-500/20 px-4 py-1.5 text-xs text-cyan-400">
              {hero.badge}
            </span>
          )}

          <h1 className="mt-4 text-3xl font-black text-white">
            {hero.title || "Your title goes here"}
          </h1>
          <h2 className="mt-2 text-xl font-bold text-cyan-400">
            {hero.subtitle || "Your subtitle goes here"}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {hero.description || "Your description goes here."}
          </p>

          {hero.showButtons && (
            <div className="mt-6 flex flex-wrap gap-3">
              {hero.button1Text && (
                <Link
                  href={hero.button1Link || "#"}
                  className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {hero.button1Text}
                </Link>
              )}
              {hero.button2Text && (
                <Link
                  href={hero.button2Link || "#"}
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-white"
                >
                  {hero.button2Text}
                </Link>
              )}
            </div>
          )}

          {hero.mainImage && (
            <div className="relative mt-6 h-48 w-full overflow-hidden rounded-2xl">
              <Image
                src={hero.mainImage}
                alt="Main hero preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Small preview strip of the 6 satellite images, if any are set */}
          {(hero.image1 ||
            hero.image2 ||
            hero.image3 ||
            hero.image4 ||
            hero.image5 ||
            hero.image6) && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                hero.image1,
                hero.image2,
                hero.image3,
                hero.image4,
                hero.image5,
                hero.image6,
              ]
                .filter(Boolean)
                .map((src, i) => (
                  <div
                    key={i}
                    className="relative h-16 w-full overflow-hidden rounded-lg border border-white/10"
                  >
                    <Image
                      src={src}
                      alt={`Floating image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500"
        />
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 px-4 py-3">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-cyan-500"
      />
    </label>
  );
}

// Reusable upload control for a single image slot: preview, remove, file input.
function ImageUploadField({
  label,
  helper,
  value,
  uploading,
  disabled,
  onUpload,
  onRemove,
}: {
  label: string;
  helper?: string;
  value: string;
  uploading: boolean;
  disabled: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  function handleRemove() {
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <label className="mb-1 block text-sm font-semibold text-slate-300">
        {label}
      </label>
      {helper && <p className="mb-3 text-xs text-slate-500">{helper}</p>}

      {value ? (
        <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl border border-white/10">
          <Image src={value} alt={`${label} preview`} fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-3 top-3 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mb-3 flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-white/15 text-sm text-slate-500">
          No image uploaded yet
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        disabled={disabled}
        className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
      />

      {uploading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-cyan-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">
        Max 5MB. JPG, PNG, or WEBP recommended.
      </p>
    </div>
  );
}