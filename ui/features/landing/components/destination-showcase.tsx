import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import type { DestinationHighlight } from "../types";

interface DestinationShowcaseProps {
  destinations: DestinationHighlight[];
}

export function DestinationShowcase({
  destinations,
}: DestinationShowcaseProps) {
  return (
    <section className="relative -mt-8 py-24 px-6 rounded-t-4xl z-100">
      <div className="max-w-6xl mx-auto" data-animate>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <p className="text-travel-primary font-semibold uppercase tracking-wide">
              Destinations we love
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance mt-2">
              Curated escapes across the globe
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-xl">
            Explore iconic cities, hidden gems, and breathtaking landscapes.
            Each itinerary is handcrafted to match your vibe and pace.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination, index) => (
            <Card
              key={destination.name}
              className="group overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              data-animate
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative h-64">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500"
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-40" />
                <CardContent className="absolute bottom-4 left-4 right-4 p-0">
                  <div className="space-y-1 text-white">
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-white/80">
                      {destination.tagline}
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
