"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Save,
  Users,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
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
// Replace these with your own Cloudinary credentials.
const CLOUDINARY_CLOUD_NAME = "dcrfg8smg";
const CLOUDINARY_UPLOAD_PRESET = "honeybadger_upload";
const FIRESTORE_COLLECTION = "team_members";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  email: string;
  phone: string;
  isNew?: boolean;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
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
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
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
    } catch (err) {
      console.error("Failed to load team members:", err);
      setErrorMessage("Failed to load team members. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  // ---------- LOCAL STATE HELPERS ----------
  function addMember() {
    const newId = `new-${Date.now()}`;
    setMembers((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        position: "",
        image: "",
        email: "",
        phone: "",
        isNew: true,
      },
    ]);
  }

  function updateMember(id: string, field: keyof TeamMember, value: string) {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  }

  async function deleteMember(id: string) {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    if (!confirm(`Delete ${member.name || "this member"}? This cannot be undone.`)) {
      return;
    }

    // If it was never saved to Firestore, just remove locally
    if (member.isNew) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      return;
    }

    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete member:", err);
      setErrorMessage("Failed to delete member. Please try again.");
    }
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
      updateMember(id, "image", url);
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

  // ---------- SAVE TO FIRESTORE ----------
  function validateMembers(): string | null {
    for (const member of members) {
      if (!member.name.trim()) return "Every member needs a name.";
      if (!member.position.trim()) return "Every member needs a position.";
      if (member.email && !/^\S+@\S+\.\S+$/.test(member.email)) {
        return `Invalid email for ${member.name || "a team member"}.`;
      }
    }
    return null;
  }

  async function saveMembers() {
    const validationError = validateMembers();
    if (validationError) {
      setErrorMessage(validationError);
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      await Promise.all(
        members.map((member) => {
          const { isNew, id, ...rest } = member;
          const docId = isNew ? undefined : id;
          const ref = docId
            ? doc(db, FIRESTORE_COLLECTION, docId)
            : doc(collection(db, FIRESTORE_COLLECTION));
          return setDoc(ref, {
            ...rest,
            updatedAt: serverTimestamp(),
          });
        })
      );

      await loadMembers(); // refresh with real Firestore IDs
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to save team:", err);
      setErrorMessage("Failed to save team. Please try again.");
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
          <h1 className="text-4xl font-black text-white">Team CMS</h1>
          <p className="mt-2 text-slate-400">
            Manage your company team members.
          </p>
        </div>

        <button
          onClick={addMember}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Error banner */}
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

      {/* Members */}
      {members.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-12 text-center text-slate-400">
          No team members yet. Click "Add Member" to get started.
        </div>
      ) : (
        <div className="space-y-8">
          {members.map((member) => {
            const isUploading = uploadingId === member.id;
            const progress = uploadProgress[member.id] ?? 0;

            return (
              <div
                key={member.id}
                className="rounded-3xl border border-white/10 bg-slate-900 p-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={22} className="text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">
                      {member.name || "Team Member"}
                    </h2>
                  </div>

                  <button
                    onClick={() => deleteMember(member.id)}
                    className="rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Form */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-semibold text-white">
                      Name
                    </label>
                    <input
                      value={member.name}
                      onChange={(e) =>
                        updateMember(member.id, "name", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-white">
                      Position
                    </label>
                    <input
                      value={member.position}
                      onChange={(e) =>
                        updateMember(member.id, "position", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-semibold text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(member.id, "email", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-white">
                      Phone
                    </label>
                    <input
                      value={member.phone}
                      onChange={(e) =>
                        updateMember(member.id, "phone", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mt-6">
                  <label className="mb-2 block font-semibold text-white">
                    Profile Image
                  </label>

                  <input
                    ref={(el) => {
                      fileInputRefs.current[member.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(member.id, e)}
                  />

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => triggerFileSelect(member.id)}
                      disabled={isUploading}
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium text-white transition hover:border-cyan-400 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                      {isUploading ? `Uploading ${progress}%` : "Upload Image"}
                    </button>

                    <input
                      value={member.image}
                      onChange={(e) =>
                        updateMember(member.id, "image", e.target.value)
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

                {member.image && !isUploading && (
                  <img
                    src={member.image}
                    alt={member.name || "Team member"}
                    className="mt-6 h-56 w-56 rounded-2xl object-cover"
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
          onClick={saveMembers}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {saveStatus === "saving" ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {saveStatus === "saving" ? "Saving..." : "Save Team"}
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