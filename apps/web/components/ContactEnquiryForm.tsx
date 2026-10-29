"use client";

import { useState, type FormEvent } from "react";

const WHATSAPP_NUMBER = "918778844987";

const BUSINESS_TYPES = [
  "Textile / Retail",
  "Restaurant / Hotel",
  "School / College",
  "Other Business",
];

export default function ContactEnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    company: "",
    businessType: "",
    service: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const mobile = formData.mobile.trim();
    const company = formData.company.trim();
    const businessType = formData.businessType.trim();
    const service = formData.service.trim();
    const message = formData.message.trim();

    if (!name || !mobile || !company || !businessType || !service) {
      return;
    }

    const digits = mobile.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      return;
    }

    const whatsappMessage = [
      "Hello ZentoviaTech,",
      "",
      "I would like to enquire about your software/services.",
      "",
      `Name: ${name}`,
      `Mobile: ${mobile}`,
      `Business: ${company}`,
      `Business Type: ${businessType}`,
      `Requirement: ${service}`,
      message ? `Message: ${message}` : "",
      "",
      "Please contact me regarding this requirement.",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="rounded-[28px] border border-white/20 bg-[#0B1220] p-7 text-white shadow-2xl md:p-10">
      <div className="mb-6">
        <h3 className="text-2xl font-black tracking-tight md:text-3xl">
          Start a Conversation
        </h3>
        <p className="mt-2 text-sm text-white/60">
          Tell us about your requirement and we will guide you from there.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="enquiry-name" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
              Name *
            </label>
            <input
              id="enquiry-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#FF4A17] focus:bg-white/[0.08]"
            />
          </div>

          <div>
            <label htmlFor="enquiry-mobile" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
              Mobile Number *
            </label>
            <input
              id="enquiry-mobile"
              type="tel"
              inputMode="numeric"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 98765 43210"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#FF4A17] focus:bg-white/[0.08]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="enquiry-company" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
              Business / Company Name *
            </label>
            <input
              id="enquiry-company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your business name"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#FF4A17] focus:bg-white/[0.08]"
            />
          </div>

          <div>
            <label htmlFor="enquiry-business-type" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
              Business Type *
            </label>
            <select
              id="enquiry-business-type"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF4A17]"
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="enquiry-service" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
            Required Software / Service *
          </label>
          <input
            id="enquiry-service"
            type="text"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            placeholder="e.g. Inventory app, POS system, website redesign"
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#FF4A17] focus:bg-white/[0.08]"
          />
        </div>

        <div>
          <label htmlFor="enquiry-message" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
            Additional Message
          </label>
          <textarea
            id="enquiry-message"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us more about your requirement, timeline, or goals."
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#FF4A17] focus:bg-white/[0.08]"
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4A17] py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e03f12]"
        >
          Send Requirement via WhatsApp →
        </button>

        <p className="text-center text-[11px] text-white/60">
          {submitted
            ? "WhatsApp has been opened. Please press Send to transmit the message."
            : "WhatsApp will open with your enquiry details so you can press Send."}
        </p>
      </form>
    </div>
  );
}
