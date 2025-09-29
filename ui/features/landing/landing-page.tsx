"use client";

import { useRouter } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";

import { CtaSection } from "./components/cta-section";
import { DestinationShowcase } from "./components/destination-showcase";
import { FeaturesGrid } from "./components/features-grid";
import { HeroSection } from "./components/hero-section";
import { StatsStrip } from "./components/stats-strip";
import { DESTINATION_HIGHLIGHTS, LANDING_FEATURES, TRAVEL_STATS } from "./data";
import { useScrollReveal } from "./hooks/use-scroll-reveal";

export function LandingPage() {
  const router = useRouter();

  useScrollReveal({ rootMargin: "0px 0px -50px 0px" });

  const handleStartPlanning = () => router.push("/planning");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader onCtaClick={handleStartPlanning} />
      <main className="flex-1">
        <HeroSection onStartPlanning={handleStartPlanning} />
        <FeaturesGrid features={LANDING_FEATURES} />
        <StatsStrip stats={TRAVEL_STATS} />
        <DestinationShowcase destinations={DESTINATION_HIGHLIGHTS} />
        <CtaSection onStartPlanning={handleStartPlanning} />
      </main>
    </div>
  );
}
