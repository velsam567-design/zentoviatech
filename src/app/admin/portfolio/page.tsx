"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Save,
  FolderKanban,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config"; // adjust this import to your firebase config file

// ---------- CONFIG ----------
const CLOUDINARY_CLOUD_NAME = "dcrfg8smg";
const CLOUDINARY_UPLOAD_PRESET = "honeybadger_upload";
const FIRESTORE_COLLECTION = "portfolio";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  order: number;
  isNew?: boolean;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ---------- LOAD FROM FIRESTORE ----------
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
      const data: Project[] = snapshot.docs
        .map((docSnap) => {
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
        })
        .sort((a, b) => a.order - b.order);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
      setErrorMessage("Failed to load portfolio. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  // ---------- LOCAL STATE HELPERS ----------
  function addProject() {
    const newId = `new-${Date.now()}`;
    setProjects((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        category: "",
        description: "",
        image: "",
        link: "",
        order: prev.length,
        isNew: true,
      },
    ]);
  }

  function updateProject(
    id: string,
    field: keyof Project,
    value: string | number
  ) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  }

  async function deleteProject(id: string) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    if (
      !confirm(
        `Delete "${project.title || "this project"}"? This cannot be undone.`
      )
    ) {
      return;
    }

    if (project.isNew) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      setErrorMessage("Failed to delete project. Please try again.");
    }
  }

  function moveProject(id: string, direction: "up" | "down") {
    setProjects((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((project, i) => ({ ...project, order: i }));
    });
  }

  // ---------- CLOUDINARY IMAGE UPLOAD ----------
  function triggerFileSelect(id: string) {
    fileInputRefs.current[id]?.click();
  }

  async function handleImageUpload(
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    setUploadingId(id);
    setUploadProgress((prev) => ({ ...prev, [id]: 0 }));
    setErrorMessage("");

    try {
      const url = await uploadToCloudinary(file, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [id]: progress }));
      });
      updateProject(id, "image", url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setErrorMessage("Image upload failed. Please try again.");
    } finally {
      setUploadingId(null);
      setUploadProgress((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
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
  function validateProjects(): string | null {
    for (const project of projects) {
      if (!project.title.trim()) return "Every project needs a title.";
      if (!project.image.trim())
        return `"${project.title}" needs an image.`;
      if (project.link && !/^https?:\/\/.+/.test(project.link)) {
        return `Project link for "${project.title}" must start with http:// or https://`;
      }
    }
    return null;
  }

  // ---------- SAVE TO FIRESTORE ----------
  async function saveProjects() {
    const validationError = validateProjects();
    if (validationError) {
      setErrorMessage(validationError);
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      await Promise.all(
        projects.map((project, index) => {
          const { isNew, id, ...rest } = project;
          const docId = isNew ? undefined : id;
          const ref = docId
            ? doc(db, FIRESTORE_COLLECTION, docId)
            : doc(collection(db, FIRESTORE_COLLECTION));
          return setDoc(ref, {
            ...rest,
            order: index,
            updatedAt: serverTimestamp(),
          });
        })
      );

      await loadProjects(); // refresh with real Firestore IDs
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to save portfolio:", err);
      setErrorMessage("Failed to save portfolio. Please try again.");
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
          <h1 className="text-4xl font-black text-white">Portfolio CMS</h1>
          <p className="mt-2 text-slate-400">
            Manage the projects shown in your portfolio.
          </p>
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={18} />
          Add Project
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

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-12 text-center text-slate-400">
          No projects yet. Click "Add Project" to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => {
            const isUploading = uploadingId === project.id;
            const progress = uploadProgress[project.id] ?? 0;

            return (
              <div
                key={project.id}
                className="rounded-3xl border border-white/10 bg-slate-900 p-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderKanban size={22} className="text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">
                      {project.title || "Project"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveProject(project.id, "up")}
                        disabled={index === 0}
                        title="Move up"
                        className="rounded-t-lg border border-slate-700 bg-slate-800 px-2 py-1 text-slate-400 transition hover:text-cyan-400 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveProject(project.id, "down")}
                        disabled={index === projects.length - 1}
                        title="Move down"
                        className="rounded-b-lg border border-t-0 border-slate-700 bg-slate-800 px-2 py-1 text-slate-400 transition hover:text-cyan-400 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-semibold text-white">
                      Title
                    </label>
                    <input
                      value={project.title}
                      onChange={(e) =>
                        updateProject(project.id, "title", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-white">
                      Category
                    </label>
                    <input
                      value={project.category}
                      onChange={(e) =>
                        updateProject(project.id, "category", e.target.value)
                      }
                      placeholder="e.g. Web Development"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block font-semibold text-white">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={project.description}
                    onChange={(e) =>
                      updateProject(
                        project.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="mt-6">
                  <label className="mb-2 flex items-center gap-2 font-semibold text-white">
                    <ExternalLink size={16} />
                    Live Project Link (optional)
                  </label>
                  <input
                    value={project.link}
                    onChange={(e) =>
                      updateProject(project.id, "link", e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Image Upload */}
                <div className="mt-6">
                  <label className="mb-2 block font-semibold text-white">
                    Project Image
                  </label>

                  <input
                    ref={(el) => {
                      fileInputRefs.current[project.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(project.id, e)}
                  />

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => triggerFileSelect(project.id)}
                      disabled={isUploading}
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium text-white transition hover:border-cyan-400 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      {isUploading
                        ? `Uploading ${progress}%`
                        : "Upload Image"}
                    </button>

                    <input
                      value={project.image}
                      onChange={(e) =>
                        updateProject(project.id, "image", e.target.value)
                      }
                      placeholder="Or paste an image URL"
                      className="min-w-[220px] flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  {isUploading && (
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-cyan-400 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {project.image && !isUploading && (
                  <img
                    src={project.image}
                    alt={project.title || "Project"}
                    className="mt-6 h-56 w-full max-w-md rounded-2xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={saveProjects}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {saveStatus === "saving" ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saveStatus === "saving" ? "Saving..." : "Save Portfolio"}
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