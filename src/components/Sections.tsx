import Canvas from "./CanvasWrapper";
import { motion } from "framer-motion";
import {
  commercialTerms,
  company,
  decarbon,
  epcWorkflow,
  faqs,
  paymentSchedule,
  people,
  projectSnapshot,
  projects,
  qualityStandards,
  scopeMatrix,
  warranty,
} from "../data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6 } }),
};

export function Company() {
  return (
    <section id="company" className="relative section-pad bg-gradient-to-b from-[#060a16] to-[#03060f]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">The Company</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-5xl">
            Building a <span className="text-gradient-solar">brighter</span> tomorrow, today.
          </h2>
          <p className="mt-5 text-slate-300">{company.intro}</p>
          <p className="mt-4 text-slate-400">
            As a turnkey EPC partner, KSE handles design, engineering, procurement, installation,
            government approvals (MNRE / CEIG / MEDA), net-metering and lifetime O&M — all under one roof.
            Our designs follow standard codes and rigorous quality-assurance at both manufacturing and execution levels.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {warranty.map((w, i) => (
              <motion.div key={w.item} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass rounded-xl p-4">
                <div className="text-2xl font-black text-gradient-solar">{w.years}</div>
                <div className="text-xs text-slate-400">{w.item} Warranty</div>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-cyan-500/10 blur-2xl" />
          <div className="relative grid grid-cols-2 gap-4">
            {[
              ["Turnkey EPC", "End-to-end delivery"],
              ["WAAREE Partner", "One with the Sun"],
              ["30-Yr Lifecycle", "Built to last"],
              ["AI Monitoring", "24×7 remote O&M"],
            ].map(([t, s], i) => (
              <div key={t} className={`glass rounded-2xl p-6 ${i % 2 ? "mt-6" : ""}`}>
                <div className="mb-3 h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 glow-gold" />
                <div className="font-bold text-white">{t}</div>
                <div className="text-sm text-slate-400">{s}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Decarbon() {
  return (
    <section id="decarbon" className="relative section-pad bg-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Decarbonisation Solutions</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            A full path to <span className="text-gradient-cyan">net zero</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {decarbon.map((d, i) => (
            <motion.div key={d.title} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="group glass rounded-2xl p-7 transition hover:border-amber-400/30 hover:bg-white/5">
              <div className="text-4xl transition group-hover:scale-110">{d.icon}</div>
              <h3 className="mt-4 text-xl font-bold text-white">{d.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{d.desc}</p>
              <div className="mt-4 text-sm font-semibold text-amber-400 opacity-0 transition group-hover:opacity-100">Learn more →</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative section-pad bg-gradient-to-b from-[#03060f] to-[#060a16]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Our Projects</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            Powering <span className="text-gradient-solar">real impact</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div key={p.name} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="group relative overflow-hidden rounded-3xl glass p-7">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl transition group-hover:bg-amber-500/20" />
              <div className="relative flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                  <p className="text-sm text-slate-400">{p.type} · {p.location}</p>
                </div>
                <span className="rounded-full glass-gold px-3 py-1 text-sm font-bold text-amber-300">{p.capacity}</span>
              </div>
              <div className="relative mt-6 flex items-center gap-6">
                <div>
                  <div className="text-2xl font-black text-emerald-400">{p.co2}</div>
                  <div className="text-xs text-slate-500">CO₂ avoided</div>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="flex-1 text-sm text-slate-400">Designed, built & commissioned turnkey by KSE.</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Resources() {
  const items = [
    { tag: "Guide", title: "Rooftop Solar Buyer's Handbook", read: "8 min" },
    { tag: "Whitepaper", title: "Bifacial vs Monofacial: Yield Study", read: "12 min" },
    { tag: "Blog", title: "Understanding Net-Metering & Subsidies", read: "5 min" },
    { tag: "Case Study", title: "850 kW Industrial EPC Deep-Dive", read: "10 min" },
  ];
  return (
    <section id="resources" className="relative section-pad bg-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Resources</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            Knowledge <span className="text-gradient-cyan">Hub</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.a key={it.title} href="#contact" custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="group flex flex-col justify-between rounded-2xl glass p-6 transition hover:border-cyan-400/30 hover:bg-white/5">
              <div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs text-cyan-300">{it.tag}</span>
                <h3 className="mt-4 text-lg font-bold text-white">{it.title}</h3>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <span>{it.read} read</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function People() {
  return (
    <section id="people" className="relative section-pad bg-gradient-to-b from-[#060a16] to-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">People</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            The minds behind the <span className="text-gradient-solar">mission</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {people.map((m, i) => (
            <motion.div key={m.name} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="group rounded-3xl glass p-7 text-center transition hover:bg-white/5">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-2xl font-black text-black transition group-hover:scale-105 glow-gold">
                {m.initials}
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{m.name}</h3>
              <p className="text-sm text-amber-400">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Investors() {
  const metrics = [
    { k: "Revenue CAGR", v: "62%" },
    { k: "Capacity Pipeline", v: "48 MW" },
    { k: "Order Book", v: "₹210 Cr" },
    { k: "ESG Rating", v: "AA" },
  ];
  return (
    <section id="investors" className="relative overflow-hidden section-pad bg-[#03060f]">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-20" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Investor Relations</p>
            <h2 className="font-display mt-3 text-4xl font-black text-white md:text-5xl">
              Invest in <span className="text-gradient-cyan">infinite</span> energy
            </h2>
            <p className="mt-5 text-slate-300">
              Kaustubh Solar Evolution is scaling rapidly across India and global markets.
              Partner with us to power the clean-energy transition and capture durable, long-term returns.
            </p>
            <a href="#contact" className="mt-7 inline-block rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 text-sm font-bold text-black transition hover:scale-105">
              Request Investor Deck
            </a>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {metrics.map((m, i) => (
              <motion.div key={m.k} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass rounded-2xl p-7 text-center">
                <div className="text-4xl font-black text-gradient-cyan">{m.v}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-slate-400">{m.k}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProfessionalScope() {
  return (
    <section id="scope" className="relative section-pad bg-gradient-to-b from-[#03060f] to-[#060a16]">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-15" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Technical & Commercial Intelligence</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            Built like a <span className="text-gradient-solar">professional EPC proposal</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Key information from the Kaustubh Solar Evolution proposal has been converted into structured website content for customers, EPC clients and investors.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projectSnapshot.map((item, i) => (
            <motion.div key={item.label} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-2xl glass p-6">
              <div className="text-xs uppercase tracking-widest text-slate-500">{item.label}</div>
              <div className="mt-2 text-2xl font-black text-white">{item.value}</div>
              <div className="mt-1 text-sm text-slate-400">{item.detail}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl glass p-7">
            <h3 className="text-2xl font-bold text-white">Scope of Supply & Works</h3>
            <p className="mt-2 text-sm text-slate-400">A clean summary of the technical scope across DC side, AC side, civil works, safety and monitoring.</p>
            <div className="mt-6 space-y-4">
              {scopeMatrix.map((scope, i) => (
                <motion.div key={scope.category} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-l border-amber-400/40 pl-4">
                  <div className="font-semibold text-amber-300">{scope.category}</div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-300">{scope.items}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl glass p-7">
            <h3 className="text-2xl font-bold text-white">Quality Assurance</h3>
            <p className="mt-2 text-sm text-slate-400">Execution quality is positioned as a business advantage, not just an installation step.</p>
            <div className="mt-6 grid gap-3">
              {qualityStandards.map((standard, i) => (
                <motion.div key={standard} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  <span className="text-sm leading-relaxed text-slate-300">{standard}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EPCProcess() {
  return (
    <section id="epc" className="relative section-pad bg-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">EPC Delivery Process</p>
            <h2 className="font-display mt-3 text-4xl font-black text-white md:text-5xl">
              From site survey to <span className="text-gradient-cyan">commissioned plant</span>
            </h2>
            <p className="mt-5 text-slate-400">
              The experience now explains how KSE works in the real world: technical feasibility, engineering, approvals, procurement, installation, testing, monitoring and handover.
            </p>
            <div className="mt-8 rounded-3xl glass-gold p-6">
              <div className="text-sm uppercase tracking-widest text-amber-300">Payment Milestones</div>
              <div className="mt-5 space-y-4">
                {paymentSchedule.map((term) => (
                  <div key={term.milestone} className="flex items-start gap-4">
                    <div className="text-2xl font-black text-gradient-solar">{term.percent}</div>
                    <div>
                      <div className="font-semibold text-white">{term.milestone}</div>
                      <div className="text-sm text-slate-400">{term.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400 via-amber-400 to-transparent md:block" />
            <div className="space-y-5">
              {epcWorkflow.map((step, i) => (
                <motion.div key={step.phase} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative rounded-2xl glass p-6 md:ml-14">
                  <div className="absolute -left-14 top-6 hidden h-12 w-12 items-center justify-center rounded-full bg-[#07101d] text-sm font-black text-cyan-300 ring-1 ring-cyan-400/40 md:flex">
                    {step.phase}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-cyan-300 md:hidden">Phase {step.phase}</div>
                  <h3 className="mt-1 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CommercialInfo() {
  return (
    <section id="commercial" className="relative section-pad bg-gradient-to-b from-[#060a16] to-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Commercial Transparency</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            Clear pricing logic for <span className="text-gradient-solar">decision makers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A professional website should communicate both technical value and financial clarity. These terms reflect the reference 3.5 kW proposal structure.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {commercialTerms.map((term, i) => (
            <motion.div key={term.label} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-2xl glass p-6 text-center">
              <div className="text-xs uppercase tracking-widest text-slate-500">{term.label}</div>
              <div className="mt-2 text-2xl font-black text-white">{term.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl glass p-7">
          <h3 className="text-2xl font-bold text-white">Client responsibilities and assumptions</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Access to roof, construction power and construction water are assumed to be provided by the client at no extra cost.",
              "Power evacuation from solar plant is considered at 230 V and feeder/tapping point coordination is part of project planning.",
              "Indoor space for inverters and control panels is to be made available wherever applicable.",
              "Any statutory tax or duty variation at dispatch or invoicing stage is considered to the purchaser's account.",
            ].map((item, i) => (
              <motion.div key={item} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-xl bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative section-pad bg-[#03060f]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">FAQ</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            Questions before <span className="text-gradient-cyan">you go solar</span>
          </h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={faq.q} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-2xl glass p-6">
              <h3 className="text-lg font-bold text-white">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
