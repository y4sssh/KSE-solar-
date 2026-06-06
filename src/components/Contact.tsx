import Canvas from "./CanvasWrapper";
import { useState } from "react";
import { motion } from "framer-motion";
import { bankingDetails, company, proposalDisclaimer } from "../data";

const inquiryTypes = ["Residential Rooftop", "Commercial EPC", "Industrial Solar", "Investor / Partner"];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [inquiry, setInquiry] = useState(inquiryTypes[0]);

  return (
    <section id="contact" className="relative overflow-hidden section-pad bg-gradient-to-b from-[#02030a] via-[#03060f] to-[#02030a]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Contact KSE</p>
            <h2 className="font-display mt-3 text-4xl font-black leading-tight text-white md:text-6xl">
              Solar EPC <span className="text-gradient-solar">command hub</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              Start a structured conversation with Kaustubh Solar Evolution for rooftop solar, commercial EPC, industrial decarbonisation, storage integration or investment-grade clean-energy opportunities.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["EPC", "Turnkey delivery"],
              ["30Y", "Module lifecycle"],
              ["98%", "Inverter efficiency"],
              ["WAAREE", "Technology partner"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl glass p-4 text-center">
                <div className="text-2xl font-black text-gradient-solar">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-3xl glass-gold p-7">
              <div className="text-xs uppercase tracking-[0.35em] text-amber-300">Official Business Desk</div>
              <h3 className="mt-3 text-2xl font-black text-white">Kaustubh Solar Evolution</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{company.subtitle}</p>

              <div className="mt-6 space-y-3">
                <Detail label="Contact Person" value={company.contactPerson} />
                <Detail label="Phone" value={company.phone} href={`tel:${company.phone.replace(/\s|-/g, "")}`} />
                <Detail label="Email" value={company.email} href={`mailto:${company.email}`} />
                <Detail label="GSTIN" value={company.gstin} />
                <Detail label="Address" value={company.location} />
                <Detail label="Technology Partner" value={company.partner} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a href={`tel:${company.phone.replace(/\s|-/g, "")}`} className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-center text-sm font-bold text-black transition hover:scale-[1.02]">
                  Call EPC Desk
                </a>
                <a href={`mailto:${company.email}`} className="rounded-full glass px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                  Email Proposal Team
                </a>
              </div>
            </div>

            <div className="rounded-3xl glass p-7">
              <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">What To Share</div>
              <div className="mt-5 grid gap-3">
                {[
                  "Latest electricity bill and sanctioned load",
                  "Roof size, roof type and shadow constraints",
                  "Site address and preferred commissioning timeline",
                  "Need for net-metering, storage, EV charging or monitoring",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-white/[0.03] p-4 text-sm text-slate-300">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,225,255,0.8)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="relative overflow-hidden rounded-3xl glass p-6 lg:col-span-7 md:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            {sent ? (
              <div className="relative flex min-h-[34rem] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 text-3xl font-black text-black glow-gold">K</div>
                <h3 className="mt-6 text-3xl font-black text-white">Inquiry received</h3>
                <p className="mt-3 max-w-md text-slate-400">Thank you. The KSE team will review your requirement and respond with the next EPC consultation step.</p>
                <button type="button" onClick={() => setSent(false)} className="mt-8 rounded-full glass px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Send another inquiry
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-amber-300">Project Briefing Terminal</div>
                    <h3 className="mt-2 text-2xl font-black text-white">Request a solar consultation</h3>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">Response target: 24 hours</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInquiry(type)}
                      aria-pressed={inquiry === type}
                      className={`rounded-2xl border px-3 py-3 text-xs font-semibold transition ${inquiry === type ? "glass-gold border-amber-400/40 text-white" : "glass border-white/5 text-slate-400 hover:text-white"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Full Name" placeholder="Your name" />
                  <Input label="Phone" placeholder="+91 ..." />
                  <Input label="Email" placeholder="you@email.com" type="email" />
                  <Input label="Location" placeholder="City, state" />
                  <Input label="Monthly Bill" placeholder="Approx. INR / month" />
                  <Input label="Roof / Site Size" placeholder="Sq.ft / acres / kW target" />
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Requirement Summary</label>
                  <textarea rows={5} placeholder={`Tell us about your ${inquiry.toLowerCase()} requirement, timeline, load and goals.`} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-slate-600 outline-none transition focus:border-amber-400/50" />
                </div>

                <div className="mt-5 rounded-2xl bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
                  By submitting this inquiry, you are requesting KSE to contact you for solar EPC consultation. Final technical and commercial proposals are subject to site survey, statutory approvals and feasibility validation.
                </div>

                <button type="submit" className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-sm font-black text-black transition hover:scale-[1.015] hover:shadow-[0_0_35px_-12px_rgba(255,184,0,0.95)]">
                  Submit Project Brief
                </button>
              </div>
            )}
          </motion.form>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl glass p-7">
            <div className="text-xs uppercase tracking-[0.35em] text-amber-400">Banking Details</div>
            <h3 className="mt-3 text-2xl font-black text-white">Payment Reference</h3>
            <div className="mt-5 grid gap-3 text-sm">
              <BankInfo label="A/C Name" value={bankingDetails.accountName} />
              <BankInfo label="A/C No." value={bankingDetails.accountNumber} />
              <BankInfo label="A/C Type" value={bankingDetails.accountType} />
              <BankInfo label="Bank Name" value={bankingDetails.bankName} />
              <BankInfo label="IFSC Code" value={bankingDetails.ifscCode} />
              <BankInfo label="Branch" value={bankingDetails.branch} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-amber-200/80">Please verify banking details with the official KSE contact person before initiating any payment.</p>
          </div>

          <div className="rounded-3xl glass p-7">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-400">Proposal Disclaimer</div>
            <h3 className="mt-3 text-2xl font-black text-white">Commercial & Legal Notes</h3>
            <div className="mt-5 space-y-3">
              {proposalDisclaimer.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,225,255,0.8)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-black/25 p-4 transition hover:bg-white/[0.04]">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="max-w-[68%] text-right text-sm font-semibold text-white">{value}</div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}

function Input({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-slate-600 outline-none transition focus:border-amber-400/50" />
    </div>
  );
}

function BankInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-black/30 p-3">
      <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#02030a] px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 glow-gold">
            <span className="text-lg font-black text-black">K</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">KAUSTUBH SOLAR EVOLUTION</div>
            <div className="text-[10px] tracking-[0.3em] text-amber-400">ONE SUN. INFINITE POSSIBILITIES.</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-400">
          {["Company", "Products", "Projects", "Solutions", "People", "Investors", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="transition hover:text-white">{l}</a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/5 pt-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Kaustubh Solar Evolution · Powered by WAAREE · Engineering, Procurement & Construction (EPC)
      </div>
    </footer>
  );
}