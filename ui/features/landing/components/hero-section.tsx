"use client";

import { Button } from "@/components/ui/button";

import { HERO_ICONS } from "../data";

interface HeroSectionProps {
  onStartPlanning: () => void;
}

export function HeroSection({ onStartPlanning }: HeroSectionProps) {
  const LeftIcon = HERO_ICONS.left;
  const RightIcon = HERO_ICONS.right;

  return (
    <section className="relative grid h-[660px] place-items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/travel-cartoon-background.png"
          alt="Travel destinations collage"
          className="h-full w-full object-cover  rounded-t-4xl"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center space-y-6 px-6 text-center"
        data-animate
      >
        <div className="flex items-center justify-center gap-4">
          <LeftIcon className="w-12 h-12 text-travel-sky" />
          <RightIcon className="w-12 h-12 text-travel-green" />
        </div>
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 text-balance">
          Plan Your Journey, Your Way
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 font-light text-pretty max-w-2xl mx-auto">
          Discover destinations, craft itineraries, and make every trip
          unforgettable with a planner built for explorers.
        </p>
        <Button
          onClick={onStartPlanning}
          className="h-16 px-16 text-xl font-semibold rounded-2xl bg-travel-primary hover:bg-travel-secondary hover:text-black transition-all duration-300 hover:scale-105 text-white border-0"
        >
          <RightIcon className="mr-3 h-6 w-6" />
          Start Planning
        </Button>
      </div>
    </section>
  );
}
