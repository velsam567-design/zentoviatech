"use client";

import ContactEnquiryForm from "./ContactEnquiryForm";

const VERIFIED_CONTACT = {
  PHONE: "8778844987",
  PHONE_LINK: "tel:+918778844987",
  WHATSAPP: "+918778844987",
  WHATSAPP_LINK: "https://wa.me/918778844987",
  EMAIL: "zentoviatechno@gmail.com",
  EMAIL_LINK: "mailto:zentoviatechno@gmail.com",
  LOCATION: "Tamil Nadu, India",
};

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#FF4A17] px-5 py-24 text-white md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-white/80">
              Start Something
            </p>
            <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
              Let's build something.
            </h2>
            <p className="mt-6 text-lg text-white/85 leading-relaxed">
              Whether you need a custom business platform, an offline-first POS solution, a mobile app, or an automated workflow, our engineering team is ready to deliver.
            </p>

            <div className="mt-10 flex flex-col gap-4 font-mono text-sm text-white/95">
              <div className="flex items-center gap-3">
                <span className="text-white/60">Phone:</span>
                <a
                  href={VERIFIED_CONTACT.PHONE_LINK}
                  className="font-bold underline underline-offset-4 hover:text-white"
                >
                  {VERIFIED_CONTACT.PHONE}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/60">WhatsApp:</span>
                <a
                  href={VERIFIED_CONTACT.WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline underline-offset-4 hover:text-white"
                >
                  {VERIFIED_CONTACT.WHATSAPP}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/60">Email:</span>
                <a
                  href={VERIFIED_CONTACT.EMAIL_LINK}
                  className="font-bold underline underline-offset-4 hover:text-white"
                >
                  {VERIFIED_CONTACT.EMAIL}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/60">Location:</span>
                <span className="font-bold">{VERIFIED_CONTACT.LOCATION}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <ContactEnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

