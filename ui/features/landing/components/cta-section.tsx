"use client";

import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  onStartPlanning: () => void;
}

export function CtaSection({ onStartPlanning }: CtaSectionProps) {
  return (
    <section className="relative -mt-8 py-24 px-6 bg-travel-sky-light/40 rounded-t-4xl">
      <div className="max-w-4xl mx-auto text-center space-y-6" data-animate>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance">
          Ready to design your next adventure?
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Start with a destination, mix in your must-see spots, and let
          Wayfinder craft the perfect itinerary.
        </p>
        <Button
          onClick={onStartPlanning}
          className="rounded-full px-10 py-6 text-lg bg-travel-primary hover:bg-travel-secondary hover:text-black"
        >
          Launch the planner
        </Button>
      </div>
    </section>
  );
}
