"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { FormEvent } from "react";

type FormData = {
  name: string;
  phone: string;
  company: string;
  businessType: string;
  service: string;
  message: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const WHATSAPP_NUMBER = "918778844987";

const BUSINESS_TYPES = [
  "Textile / Retail",
  "Restaurant / Hotel",
  "School / College",
  "Other Business",
];

const SERVICE_HIGHLIGHTS = [
  { icon: "💻", label: "Custom Software" },
  { icon: "📱", label: "Mobile App Development" },
  { icon: "☁️", label: "Cloud & DevOps" },
  { icon: "🤝", label: "IT Consulting" },
  { icon: "🤖", label: "RPA" },
  { icon: "📊", label: "Power BI" },
  { icon: "⚡", label: "Power Automation" },
  { icon: "📣", label: "Digital Marketing" },
];

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  company: "",
  businessType: "",
  service: "",
  message: "",
};

function validatePhone(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function inputCls(hasError: boolean) {
  return (
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0B1220] outline-none transition placeholder:text-[#AAADBA] " +
    (hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-[#D6DCE8] focus:border-[#FF4A17] focus:ring-2 focus:ring-[#FF4A17]/20")
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#0B1220]">
        {label}
        {required && <span className="ml-0.5 text-[#FF4A17]">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ConsultationModal({ open, onClose }: Props) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimatingOut(false);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => firstInputRef.current?.focus());
      });
    } else if (visible) {
      if (reduceMotion) {
        setVisible(false);
        document.body.style.overflow = "";
      } else {
        setAnimatingOut(true);
        const t = setTimeout(() => {
          setVisible(false);
          setAnimatingOut(false);
          document.body.style.overflow = "";
        }, 200);
        return () => clearTimeout(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setForm(INITIAL_FORM);
      setErrors({});
      setSubmitted(false);
    }, 250);
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) handleClose();
    },
    [handleClose]
  );

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Enter a valid mobile number.";
    }
    if (!form.company.trim()) newErrors.company = "Business or company name is required.";
    if (!form.businessType.trim()) newErrors.businessType = "Please select a business type.";
    if (!form.service.trim()) newErrors.service = "Please tell us the required software or service.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const whatsappMessage = [
      "Hello ZentoviaTech,",
      "",
      "I would like to enquire about your software/services.",
      "",
      `Name: ${form.name.trim()}`,
      `Mobile: ${form.phone.trim()}`,
      `Business: ${form.company.trim()}`,
      `Business Type: ${form.businessType}`,
      `Requirement: ${form.service.trim()}`,
      form.message.trim() ? `Message: ${form.message.trim()}` : "",
      "",
      "Please contact me regarding this requirement.",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (!visible) return null;

  const overlayAnim = reduceMotion
    ? "opacity-100"
    : animatingOut
    ? "opacity-0"
    : "animate-in fade-in-0 duration-200 opacity-100";

  const modalAnim = reduceMotion
    ? "opacity-100 scale-100"
    : animatingOut
    ? "opacity-0 scale-[0.97]"
    : "animate-in fade-in-0 zoom-in-[0.97] duration-200";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Requirement Enquiry"
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[999] flex items-center justify-center px-4 py-4 transition-opacity ${overlayAnim}`}
      style={{ background: "rgba(5,10,20,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-[28px] shadow-[0_40px_100px_rgba(0,0,0,0.55)] transition-[opacity,transform,box-shadow] duration-200 ease-out sm:flex-row md:rounded-[32px] ${modalAnim}`}
        style={{ maxWidth: "min(1160px, calc(100vw - 32px))", maxHeight: "90vh" }}
      >
        <div
          className="relative hidden flex-shrink-0 flex-col justify-between overflow-hidden bg-[#0B1220] p-9 sm:flex sm:w-[38%] md:p-11"
          aria-hidden="true"
        >
          <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle,rgba(255,74,23,0.22) 0%,transparent 70%)" }} />
          <div className="relative z-10">
            <div className="mb-8">
              <span className="text-xl font-extrabold tracking-[-0.04em] text-white">Zentovia<span className="text-[#FF4A17]">Tech</span></span>
              <p className="mt-[3px] font-mono text-[10px] uppercase tracking-widest text-white/40">Engineering · Tamil Nadu, India</p>
            </div>
            <h2 className="text-2xl font-extrabold leading-[1.2] tracking-[-0.035em] text-white sm:text-3xl">
              Tell us what you need. <span className="text-[#FF4A17]">We&apos;ll take it further.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-[15px]">
              Share your requirement and we will help you plan the right software, workflow, or product solution.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {SERVICE_HIGHLIGHTS.map((s) => (
                <li key={s.label} className="flex items-center gap-3 text-[13px] font-medium text-white/75">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-[#FF4A17]/15 text-base">{s.icon}</span>
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative z-10 mt-8 text-[11px] leading-relaxed text-white/30">We reply within one business day. All enquiries are confidential.</p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E1E7F0] bg-white px-6 py-4 sm:px-8 sm:py-5">
            <div>
              <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#0B1220] sm:text-xl">Requirement Enquiry</h3>
              <p className="mt-0.5 text-xs text-[#8A96AA] sm:text-sm">Please fill in the details below and we will guide you.</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close requirement enquiry modal"
              className="ml-4 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-[#E1E7F0] bg-[#F2F5FA] text-[#0B1220] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#0B1220] hover:text-white"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-4xl">✅</div>
                <h4 className="text-2xl font-extrabold tracking-[-0.03em] text-[#0B1220]">WhatsApp Opened</h4>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#556078]">
                  Your enquiry details were prepared in WhatsApp. Please press <strong>Send</strong> to transmit the message to ZentoviaTech.
                </p>
                <button type="button" onClick={handleClose} className="mt-8 rounded-full bg-[#FF4A17] px-8 py-3 text-sm font-bold text-white shadow-[0_6px_24px_rgba(255,74,23,0.3)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f53d0a]">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <Field label="Name" required error={errors.name}>
                  <input ref={firstInputRef} id="cm-name" type="text" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className={inputCls(!!errors.name)} />
                </Field>

                <Field label="Mobile Number" required error={errors.phone}>
                  <input id="cm-phone" type="tel" autoComplete="tel" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls(!!errors.phone)} />
                </Field>

                <Field label="Business / Company Name" required error={errors.company}>
                  <input id="cm-company" type="text" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Your business name" className={inputCls(!!errors.company)} />
                </Field>

                <Field label="Business Type" required error={errors.businessType}>
                  <select id="cm-business-type" value={form.businessType} onChange={(e) => set("businessType", e.target.value)} className={`${inputCls(!!errors.businessType)} cursor-pointer`}>
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Required Software / Service" required error={errors.service}>
                  <input id="cm-service" type="text" value={form.service} onChange={(e) => set("service", e.target.value)} placeholder="e.g. Inventory app, POS system, website redesign" className={inputCls(!!errors.service)} />
                </Field>

                <div>
                  <label htmlFor="cm-message" className="mb-1.5 block text-sm font-semibold text-[#0B1220]">Additional Message</label>
                  <textarea id="cm-message" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us more about your requirement, timeline, or goals." className="w-full resize-none rounded-xl border border-[#D6DCE8] bg-white px-4 py-3 text-sm text-[#0B1220] outline-none transition placeholder:text-[#AAADBA] focus:border-[#FF4A17] focus:ring-2 focus:ring-[#FF4A17]/20" />
                </div>

                <button type="submit" className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF4A17] py-3.5 text-sm font-bold text-white shadow-[0_8px_28px_rgba(255,74,23,0.30)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f53d0a] hover:shadow-[0_10px_36px_rgba(255,74,23,0.45)] active:scale-[0.98]">
                  Send Requirement via WhatsApp <span aria-hidden="true" className="text-base leading-none">→</span>
                </button>

                <p className="text-center text-[11px] text-[#AAB0BC]">WhatsApp will open for you to press Send and transmit the message.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
