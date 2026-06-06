// Business data extracted from Kaustubh Solar Evolution (KSE) proposal

export const company = {
  name: "Kaustubh Solar Evolution",
  short: "KSE",
  tagline: "One Sun. Infinite Possibilities.",
  subtitle: "Make the future bright with solar power",
  intro:
    "Kaustubh Solar Evolution is a turnkey EPC (Engineering, Procurement & Construction) solar developer delivering reliable, high-efficiency rooftop and ground-mount solar power plants — engineered for a trouble-free 30-year life.",
  partner: "WAAREE — One with the Sun",
  contactPerson: "Mr. Nikhil Mohadikar",
  email: "kaustubhsolarevolution@gmail.com",
  phone: "+91-9168031615",
  gstin: "27BMZPM6624E1ZI",
  location: "Shantinagar Nagraj Sq., Nagpur, Maharashtra 440017",
};

export const bankingDetails = {
  accountName: "KAUSTUBH SOLAR EVOLUTION",
  accountNumber: "924020031964037",
  accountType: "Current Account",
  bankName: "Axis Bank Ltd.",
  ifscCode: "UTIB0000330",
  branch: "Lakadganj, Nagpur",
};

export const proposalDisclaimer = [
  "Proposal documents are prepared in good faith based on available information, site assumptions and public-domain material.",
  "Final scope, pricing, taxes, approvals and execution terms may change after site survey, statutory requirements and mutual contract finalization.",
  "Binding terms should be governed by the final EPC, material supply or service contract issued between the client and Kaustubh Solar Evolution.",
  "Payment and banking information should be verified with the official KSE contact before initiating any transaction.",
];

export const stats = [
  { label: "Module Warranty", value: "30", suffix: " yrs" },
  { label: "Inverter Efficiency", value: "98", suffix: "%" },
  { label: "Projects Delivered", value: "450", suffix: "+" },
  { label: "Tons CO₂ Saved", value: "12.8", suffix: "K" },
];

export const products = [
  {
    id: "modules",
    name: "N-Type TOPCon Bifacial Modules",
    spec: "570 / 580 Wp · Waaree Bifacial DCR",
    make: "WAAREE",
    efficiency: "22.6%",
    warranty: "30 Years",
    technology: "N-Type TOPCon Bifacial",
    material: "Monocrystalline Silicon",
    qty: "6 Nos.",
    desc: "Dual-glass bifacial cells capture sunlight from both faces, boosting yield by up to 25% with industry-leading degradation rates.",
    color: "#1b3b8f",
  },
  {
    id: "inverter",
    name: "On-Grid String Inverter",
    spec: "3.3 KVA · Single Phase · 98% Efficiency",
    make: "WAAREE",
    efficiency: "98%",
    warranty: "8 Years",
    technology: "On-Grid String MPPT",
    material: "Aluminium / IP65 Enclosure",
    qty: "1 No.",
    desc: "Smart MPPT string inverter with real-time monitoring, grid-feed protection and 98% conversion efficiency.",
    color: "#0f6b5c",
  },
  {
    id: "mounting",
    name: "Module Mounting Structure",
    spec: "GI / MS · Hot-dip Galvanised · Fixed Tilt",
    make: "Fortune Hotdeep GI",
    efficiency: "—",
    warranty: "5 Years",
    technology: "Hot-Dip Galvanised Steel",
    material: "GI / MS Steel",
    qty: "As per design",
    desc: "Penetrative tin-shed compatible mounting engineered to withstand high wind loads with corrosion-proof galvanisation.",
    color: "#5a6270",
  },
  {
    id: "cables",
    name: "Solar AC & DC Cables",
    spec: "UV-Resistant · Halogen-Free · Fire-Resistant",
    make: "Waacab / Polycab",
    efficiency: "—",
    warranty: "1 Year",
    technology: "Low-loss Copper Conductor",
    material: "Tinned Copper",
    qty: "As per design",
    desc: "Solar-grade flame-retardant cabling with minimal transmission loss for safe, durable DC & AC power routing.",
    color: "#b5651d",
  },
  {
    id: "protection",
    name: "Earthing & Lightning Protection",
    spec: "Chemical Earthing · Copper Lightning Arrestor",
    make: "Reputed Make",
    efficiency: "—",
    warranty: "5 Years",
    technology: "Chemical Maintenance-Free Earthing",
    material: "Copper",
    qty: "3 + 1 Nos.",
    desc: "Maintenance-free chemical earthing kits plus copper down-conductor lightning protection for total system safety.",
    color: "#7a4a18",
  },
  {
    id: "acdb",
    name: "ACDB & Power Evacuation",
    spec: "Schneider / Finder · 230 VAC Evacuation",
    make: "Schneider / Finder",
    efficiency: "—",
    warranty: "1 Year",
    technology: "Protected AC Distribution",
    material: "Industrial Grade",
    qty: "1 Set",
    desc: "AC distribution board with surge & overload protection enabling safe 230 V grid evacuation and net-metering.",
    color: "#2b4a5a",
  },
];

export const xrayLayers = [
  { name: "Tempered Glass", material: "Anti-reflective 3.2mm Glass", efficiency: "+3% Light Capture", warranty: "30 Years", tech: "AR Coated", color: "#bfe9ff", y: 1.6 },
  { name: "EVA Encapsulant", material: "Ethylene Vinyl Acetate", efficiency: "UV & Moisture Seal", warranty: "30 Years", tech: "POE Lamination", color: "#eaf6ff", y: 0.8 },
  { name: "Silicon Solar Cells", material: "N-Type Monocrystalline", efficiency: "22.6% Conversion", warranty: "30 Years", tech: "TOPCon Bifacial", color: "#16213a", y: 0 },
  { name: "Rear EVA Layer", material: "Ethylene Vinyl Acetate", efficiency: "Bifacial Pass-through", warranty: "30 Years", tech: "Transparent POE", color: "#dfeeff", y: -0.8 },
  { name: "Dual-Glass Backsheet", material: "Tempered Rear Glass", efficiency: "+25% Bifacial Gain", warranty: "30 Years", tech: "Glass-Glass", color: "#9fb6d6", y: -1.6 },
];

export const warranty = [
  { item: "Solar Modules", years: "30 Years" },
  { item: "Inverter", years: "8 Years" },
  { item: "GI Structure", years: "5 Years" },
  { item: "Balance of System", years: "1 Year" },
];

export const projects = [
  { name: "Hirekhan Residence", capacity: "3.5 kW", type: "Rooftop · Single Phase", location: "Amravati, MH", co2: "4.2 T/yr", img: "rooftop" },
  { name: "Waaree Industrial Park", capacity: "850 kW", type: "Ground Mount EPC", location: "Gujarat", co2: "1020 T/yr", img: "ground" },
  { name: "Green Commercial Tower", capacity: "120 kW", type: "Commercial Rooftop", location: "Pune, MH", co2: "144 T/yr", img: "commercial" },
  { name: "AgriSolar Cooperative", capacity: "2.4 MW", type: "Utility Scale", location: "Maharashtra", co2: "2880 T/yr", img: "utility" },
];

export const decarbon = [
  { title: "Rooftop Solar EPC", desc: "Turnkey residential & commercial rooftop systems with net-metering.", icon: "🏠" },
  { title: "Ground-Mount Plants", desc: "Utility-scale solar farms engineered for maximum land yield.", icon: "🌄" },
  { title: "Battery Storage", desc: "Hybrid storage for 24×7 clean power and grid independence.", icon: "🔋" },
  { title: "EV Charging Infra", desc: "Solar-powered EV charging networks for fleets & homes.", icon: "⚡" },
  { title: "Carbon Advisory", desc: "Measure, report and offset your organisation's carbon footprint.", icon: "🌍" },
  { title: "O&M Monitoring", desc: "AI-driven remote monitoring and predictive maintenance.", icon: "📡" },
];

export const people = [
  { name: "Kaustubh Patil", role: "Founder & CEO", initials: "KP" },
  { name: "Prince Hirekhan", role: "Head of Engineering", initials: "PH" },
  { name: "Anjali Deshmukh", role: "Director, Operations", initials: "AD" },
  { name: "Rohan Mehta", role: "Lead Solar Architect", initials: "RM" },
];

export const commercial = {
  capacity: "3.5 KW",
  ratePerKw: 61200,
  basePrice: 183600,
  gst: 16340,
  subsidy: 78000,
  total: 199940.5,
};

export const projectSnapshot = [
  { label: "Reference System", value: "3.5 kW Single Phase", detail: "Residential rooftop EPC configuration" },
  { label: "Location", value: "Amravati, Maharashtra", detail: "Rooftop installation model" },
  { label: "Module Technology", value: "N-Type TOPCon DCR Bifacial", detail: "WAAREE 570 / 580 Wp modules" },
  { label: "Power Evacuation", value: "230 VAC", detail: "On-grid single-phase supply" },
  { label: "Execution Model", value: "Turnkey EPC", detail: "Engineering, procurement and construction" },
  { label: "Design Life", value: "30 Years", detail: "Quality-focused system lifecycle" },
];

export const epcWorkflow = [
  {
    phase: "01",
    title: "Site Survey & Feasibility",
    desc: "Roof inspection, shadow analysis, load assessment, evacuation point verification and initial energy yield estimation.",
  },
  {
    phase: "02",
    title: "Engineering & Design",
    desc: "Plant layout, module stringing, inverter sizing, earthing design, cable routing, ACDB selection and structural drawings.",
  },
  {
    phase: "03",
    title: "Approvals & Documentation",
    desc: "Support for MNRE, MEDA, CEIG, net-metering, inspection coordination and completion documentation where applicable.",
  },
  {
    phase: "04",
    title: "Procurement & Quality Control",
    desc: "Tier-1 modules, inverter, GI structure, cables, connectors, earthing kit, lightning protection and AC protection equipment.",
  },
  {
    phase: "05",
    title: "Construction & Installation",
    desc: "MMS foundation, module installation, DC and AC cabling, inverter mounting, earthing, LT panel integration and safety checks.",
  },
  {
    phase: "06",
    title: "Testing & Commissioning",
    desc: "Pre-commissioning tests, performance verification, government inspection support, handover and remote monitoring activation.",
  },
];

export const scopeMatrix = [
  { category: "DC Side", items: "Solar PV panels, MMS, fixed tilt, string monitoring, DC cables, DC side earthing, weather monitoring, lightning arrestor" },
  { category: "AC Side", items: "String inverter, LT power cables, main LT panels, ACDB, AC side earthing, control and communication cables" },
  { category: "Civil Works", items: "MMS foundation if required, cable tray for AC/DC cables, inverter room provisions and module cleaning piping works" },
  { category: "Safety & Compliance", items: "Fire safety equipment, chemical earthing, copper lightning protection, inspection and quality assurance reports" },
  { category: "Monitoring", items: "Remote monitoring system, data logger, performance observation and post-commissioning support" },
];

export const qualityStandards = [
  "Standard-code based design and engineering practices",
  "Inspection and quality assurance at manufacturing and execution stages",
  "Reliable and proven equipment selection based on solar industry experience",
  "UV-resistant, halogen-free and fire-resistant AC/DC cable routing",
  "Chemical maintenance-free earthing and copper lightning protection",
  "Documentation handover including as-built drawings and vendor data",
];

export const commercialTerms = [
  { label: "Rate Basis", value: "INR 61,200 / kW" },
  { label: "Base Price", value: "INR 1,83,600" },
  { label: "GST", value: "8.9% basic rate" },
  { label: "Subsidy", value: "INR 78,000" },
  { label: "Estimated Total", value: "INR 1,99,940.50" },
  { label: "Offer Validity", value: "15 days from offer date" },
];

export const paymentSchedule = [
  { milestone: "Deal Closure", percent: "20%", desc: "Payable after offered price is accepted." },
  { milestone: "Material Dispatch Readiness", percent: "70%", desc: "Against pro-forma invoice confirmation." },
  { milestone: "Commissioning", percent: "10%", desc: "Against completion certificate and handover." },
];

export const faqs = [
  { q: "What makes KSE different from a normal solar installer?", a: "KSE operates as a turnkey EPC partner, managing design, procurement, construction, approvals, commissioning and monitoring under one execution framework." },
  { q: "Which module technology is used?", a: "The reference system uses WAAREE N-Type TOPCon DCR bifacial modules rated around 570 / 580 Wp with a 30-year performance warranty." },
  { q: "Does KSE support government approvals?", a: "Yes. KSE supports documentation and coordination for MNRE, MEDA, CEIG, net-metering, third-party inspection and completion certification where applicable." },
  { q: "Can this website support commercial and investor users?", a: "Yes. The content structure includes residential solar, commercial EPC, industrial systems, decarbonisation, remote monitoring and investor relations." },
];
