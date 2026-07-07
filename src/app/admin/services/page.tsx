"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Save,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  GripVertical,
  Upload,
  ImageIcon,
} from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";

const FIRESTORE_COLLECTION = "services";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Cloudinary URL
  order: number;
  isNew?: boolean;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
      const data: Service[] = snapshot.docs
        .map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || "",
            description: d.description || "",
            icon: d.icon || "",
            order: typeof d.order === "number" ? d.order : 0,
          };
        })
        .sort((a, b) => a.order - b.order);
      setServices(data);
    } catch (err) {
      console.error("Load error:", err);
      setErrorMessage("Failed to load services. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  function addService() {
    const newId = `new-${Date.now()}`;
    setServices((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        description: "",
        icon: "",
        order: prev.length,
        isNew: true,
      },
    ]);
  }

  function updateService(id: string, field: keyof Service, value: string | number) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  async function uploadIcon(id: string, file: File) {
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "services_icons");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        updateService(id, "icon", data.secure_url);
      } else {
        setErrorMessage("Image upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Image upload failed. Try again.");
    } finally {
      setUploadingId(null);
    }
  }

  async function deleteService(id: string) {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    if (!confirm(`Delete "${service.title || "this service"}"?`)) return;

    if (service.isNew) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMessage("Failed to delete. Try again.");
    }
  }

  function moveService(id: string, direction: "up" | "down") {
    setServices((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((s, i) => ({ ...s, order: i }));
    });
  }

  function validate(): string | null {
    for (const s of services) {
      if (!s.title.trim()) return "Every service needs a title.";
      if (!s.description.trim()) return "Every service needs a description.";
    }
    return null;
  }

  async function saveServices() {
    const err = validate();
    if (err) {
      setErrorMessage(err);
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      await Promise.all(
        services.map((service, index) => {
          const { isNew, id, ...rest } = service;
          const ref = isNew
            ? doc(collection(db, FIRESTORE_COLLECTION))
            : doc(db, FIRESTORE_COLLECTION, id);
          return setDoc(ref, { ...rest, order: index, updatedAt: serverTimestamp() });
        })
      );
      await loadServices();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage("Failed to save. Try again.");
      setSaveStatus("error");
    }
  }

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
          <h1 className="text-4xl font-black text-white">Services CMS</h1>
          <p className="mt-2 text-slate-400">
            Manage the services shown on your homepage.
          </p>
        </div>
        <button
          onClick={addService}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Error Banner */}
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

      {/* Services List */}
      {services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-12 text-center text-slate-400">
          No services yet. Click "Add Service" to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              total={services.length}
              uploading={uploadingId === service.id}
              onUpdate={updateService}
              onDelete={deleteService}
              onMove={moveService}
              onUpload={uploadIcon}
            />
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={saveServices}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {saveStatus === "saving" ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saveStatus === "saving" ? "Saving..." : "Save Services"}
        </button>

        {saveStatus === "success" && (
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={18} />
            Saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- SERVICE CARD ----------
function ServiceCard({
  service,
  index,
  total,
  uploading,
  onUpdate,
  onDelete,
  onMove,
  onUpload,
}: {
  service: Service;
  index: number;
  total: number;
  uploading: boolean;
  onUpdate: (id: string, field: keyof Service, value: string | number) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onUpload: (id: string, file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
      {/* Card Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase size={22} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            {service.title || "New Service"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button
              onClick={() => onMove(service.id, "up")}
              disabled={index === 0}
              className="rounded-t-lg border border-slate-700 bg-slate-800 px-2 py-1 text-slate-400 transition hover:text-cyan-400 disabled:opacity-30"
            >▲</button>
            <button
              onClick={() => onMove(service.id, "down")}
              disabled={index === total - 1}
              className="rounded-b-lg border border-t-0 border-slate-700 bg-slate-800 px-2 py-1 text-slate-400 transition hover:text-cyan-400 disabled:opacity-30"
            >▼</button>
          </div>
          <button
            onClick={() => onDelete(service.id)}
            className="rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Icon Upload + Title */}
      <div className="grid gap-6 md:grid-cols-[160px_1fr]">
        {/* Icon Upload */}
        <div>
          <label className="mb-2 block font-semibold text-white">Icon Image</label>
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 transition hover:border-cyan-400"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-cyan-400" size={28} />
            ) : service.icon ? (
              <>
                <img
                  src={service.icon}
                  alt="icon"
                  className="h-full w-full object-contain p-2"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100">
                  <Upload size={20} className="text-white" />
                </div>
              </>
            ) : (
              <>
                <ImageIcon size={28} className="text-slate-500" />
                <span className="mt-2 text-xs text-slate-500">Click to upload</span>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(service.id, file);
              e.target.value = "";
            }}
          />
          {service.icon && (
            <button
              onClick={() => onUpdate(service.id, "icon", "")}
              className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              <X size={12} /> Remove image
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block font-semibold text-white">Title</label>
          <input
            value={service.title}
            onChange={(e) => onUpdate(service.id, "title", e.target.value)}
            placeholder="e.g. Web Development"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="mb-2 block font-semibold text-white">Description</label>
        <textarea
          rows={3}
          value={service.description}
          onChange={(e) => onUpdate(service.id, "description", e.target.value)}
          placeholder="Brief description of this service..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white outline-none focus:border-cyan-400"
        />
      </div>

      {/* Position */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <GripVertical size={14} />
        Position {index + 1} of {total}
      </div>
    </div>
  );
}