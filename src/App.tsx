import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CinematicFrame from "./components/CinematicFrame";
import { SceneFallback } from "./components/CinematicAtmosphere";
import GlobalEnergyBackdrop from "./components/GlobalEnergyBackdrop";
import { CommercialInfo, Company, Decarbon, EPCProcess, FAQ, Investors, People, ProfessionalScope, Projects, Resources } from "./components/Sections";
import { Contact, Footer } from "./components/Contact";

const SolarXray = lazy(() => import("./components/SolarXray"));
const CommandCenter = lazy(() => import("./components/CommandCenter"));
const SmartHome = lazy(() => import("./components/SmartHome"));
const BatteryCore = lazy(() => import("./components/BatteryCore"));
const ImpactGlobe = lazy(() => import("./components/ImpactGlobe"));
const FutureCity = lazy(() => import("./components/FutureCity"));
const SavingCalculator = lazy(() => import("./components/SavingCalculator"));
const Products = lazy(() => import("./components/Products"));
const FinalCinematic = lazy(() => import("./components/FinalCinematic"));

function Loader({ done }: { done: boolean }) {
  if (done) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03060f]"
    >
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-spinSlow rounded-full border-2 border-amber-400/30 border-t-amber-400" />
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-2xl font-black text-black">
          K
        </div>
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.4em] text-amber-400">Initialising Solar Engine</p>
    </motion.div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative isolate bg-[#03060f]">
      <Loader done={loaded} />

      {/* scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-400"
      />

      <Navbar />
      <GlobalEnergyBackdrop />
      <CinematicFrame />

      <main className="relative z-10">
        <Hero />
        <Suspense fallback={<SceneFallback />}>
          <SolarXray />
          <CommandCenter />
          <SmartHome />
          <BatteryCore />
          <ImpactGlobe />
          <FutureCity />
          <SavingCalculator />
          <Products />
        </Suspense>
        <Company />
        <ProfessionalScope />
        <EPCProcess />
        <CommercialInfo />
        <Decarbon />
        <Projects />
        <Resources />
        <People />
        <Investors />
        <FAQ />
        <Suspense fallback={<SceneFallback />}>
          <FinalCinematic />
        </Suspense>
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
