import type { TravelStat } from "../types";

interface StatsStripProps {
  stats: TravelStat[];
}

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section className="py-20 px-6 bg-travel-beige/20 rounded-t-4xl">
      <div
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
        data-animate
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center space-y-1">
            <p className="text-3xl font-bold text-travel-primary">
              {stat.value}
            </p>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
