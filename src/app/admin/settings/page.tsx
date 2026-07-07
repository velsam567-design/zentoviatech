"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
  Search,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config"; // adjust this import to your firebase config file

// ---------- CONFIG ----------
const CLOUDINARY_CLOUD_NAME = "dcrfg8smg";
const CLOUDINARY_UPLOAD_PRESET = "honeybadger_upload";
const FIRESTORE_COLLECTION = "site_settings";
const FIRESTORE_DOC_ID = "general";

interface SettingsData {
  siteName: string;
  logo: string;
  favicon: string;
  footerText: string;
  metaTitle: string;
  metaDescription: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  siteName: "Zentovia Tech",
  logo: "",
  favicon: "",
  footerText: "© 2026 Zentovia Tech. All rights reserved.",
  metaTitle: "Zentovia Tech — Trusted Software Development Partner",
  metaDescription:
    "We build modern websites, ERP software, AI solutions, mobile applications and cloud platforms for startups and enterprises.",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",
};

type SaveStatus = "idle" | "saving" | "success" | "error";
type UploadTarget = "logo" | "favicon" | null;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadTarget, setUploadTarget] = useState<UploadTarget>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- LOAD FROM FIRESTORE ----------
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setSettings({
          siteName: d.siteName ?? DEFAULT_SETTINGS.siteName,
          logo: d.logo ?? "",
          favicon: d.favicon ?? "",
          footerText: d.footerText ?? DEFAULT_SETTINGS.footerText,
          metaTitle: d.metaTitle ?? DEFAULT_SETTINGS.metaTitle,
          metaDescription:
            d.metaDescription ?? DEFAULT_SETTINGS.metaDescription,
          facebook: d.facebook ?? "",
          instagram: d.instagram ?? "",
          linkedin: d.linkedin ?? "",
          twitter: d.twitter ?? "",
          youtube: d.youtube ?? "",
        });
      }
      // If the document doesn't exist yet, keep DEFAULT_SETTINGS so the
      // admin sees sensible starting values instead of a blank form.
    } catch (err) {
      console.error("Failed to load settings:", err);
      setErrorMessage("Failed to load settings. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof SettingsData, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  // ---------- CLOUDINARY IMAGE UPLOAD ----------
  function triggerFileSelect(target: "logo" | "favicon") {
    if (target === "logo") logoInputRef.current?.click();
    else faviconInputRef.current?.click();
  }

  async function handleImageUpload(
    target: "logo" | "favicon",
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    setUploadTarget(target);
    setUploadProgress(0);
    setErrorMessage("");

    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      updateField(target, url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setErrorMessage("Image upload failed. Please try again.");
    } finally {
      setUploadTarget(null);
      setUploadProgress(0);
    }
  }

  function uploadToCloudinary(
    file: File,
    onProgress: (percent: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } catch {
            reject(new Error("Invalid Cloudinary response"));
          }
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  }

  // ---------- VALIDATION ----------
  function validateSettings(): string | null {
    if (!settings.siteName.trim()) return "Site name is required.";

    const socialFields: Array<[keyof SettingsData, string]> = [
      ["facebook", "Facebook"],
      ["instagram", "Instagram"],
      ["linkedin", "LinkedIn"],
      ["twitter", "Twitter / X"],
      ["youtube", "YouTube"],
    ];
    for (const [field, label] of socialFields) {
      const value = settings[field];
      if (value && !/^https?:\/\/.+/.test(value)) {
        return `${label} link must start with http:// or https://`;
      }
    }
    return null;
  }

  // ---------- SAVE TO FIRESTORE ----------
  async function saveSettings() {
    const validationError = validateSettings();
    if (validationError) {
      setErrorMessage(validationError);
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      await setDoc(ref, {
        ...settings,
        updatedAt: serverTimestamp(),
      });

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setErrorMessage("Failed to save settings. Please try again.");
      setSaveStatus("error");
    }
  }

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">Settings CMS</h1>
          <p className="mt-2 text-slate-400">
            Manage site-wide settings, branding, and social links.
          </p>
        </div>

        <button
          onClick={saveSettings}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-60"
        >
          {saveStatus === "saving" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saveStatus === "saving" ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Status banners */}
      {errorMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {saveStatus === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
          <CheckCircle2 size={20} />
          Settings saved successfully.
        </div>
      )}

      {/* Branding */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
        <div className="mb-6 flex items-center gap-3">
          <ImageIcon size={22} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Branding</h2>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Site Name
          </label>
          <input
            value={settings.siteName}
            onChange={(e) => updateField("siteName", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Logo */}
          <div>
            <label className="mb-2 block font-semibold text-white">
              Logo
            </label>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload("logo", e)}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => triggerFileSelect("logo")}
                disabled={uploadTarget === "logo"}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white transition hover:border-cyan-400 disabled:opacity-50"
              >
                {uploadTarget === "logo" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploadTarget === "logo"
                  ? `${uploadProgress}%`
                  : "Upload Logo"}
              </button>

              {settings.logo && (
                <img
                  src={settings.logo}
                  alt="Logo preview"
                  className="h-12 w-auto rounded-lg bg-white/5 object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>

            <input
              value={settings.logo}
              onChange={(e) => updateField("logo", e.target.value)}
              placeholder="Or paste an image URL"
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="mb-2 block font-semibold text-white">
              Favicon
            </label>

            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload("favicon", e)}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => triggerFileSelect("favicon")}
                disabled={uploadTarget === "favicon"}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white transition hover:border-cyan-400 disabled:opacity-50"
              >
                {uploadTarget === "favicon" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploadTarget === "favicon"
                  ? `${uploadProgress}%`
                  : "Upload Favicon"}
              </button>

              {settings.favicon && (
                <img
                  src={settings.favicon}
                  alt="Favicon preview"
                  className="h-10 w-10 rounded-lg bg-white/5 object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>

            <input
              value={settings.favicon}
              onChange={(e) => updateField("favicon", e.target.value)}
              placeholder="Or paste an image URL"
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
        <div className="mb-6 flex items-center gap-3">
          <Search size={22} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">SEO</h2>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Meta Title
          </label>
          <input
            value={settings.metaTitle}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-semibold text-white">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={settings.metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Social Links</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-white">
              <FaFacebookF size={18} />
              Facebook
            </label>
            <input
              value={settings.facebook}
              onChange={(e) => updateField("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-white">
              <FaInstagram size={18} />
              Instagram
            </label>
            <input
              value={settings.instagram}
              onChange={(e) => updateField("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-white">
              <FaLinkedinIn size={18} />
              LinkedIn
            </label>
            <input
              value={settings.linkedin}
              onChange={(e) => updateField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-white">
              <FaXTwitter size={18} />
              Twitter / X
            </label>
            <input
              value={settings.twitter}
              onChange={(e) => updateField("twitter", e.target.value)}
              placeholder="https://x.com/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-white">
              <FaYoutube size={18} />
              YouTube
            </label>
            <input
              value={settings.youtube}
              onChange={(e) => updateField("youtube", e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Footer</h2>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Footer Text
          </label>
          <input
            value={settings.footerText}
            onChange={(e) => updateField("footerText", e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}