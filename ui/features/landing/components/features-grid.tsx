"use client";

import { Card, CardContent } from "@/components/ui/card";

import type { LandingFeature } from "../types";

interface FeaturesGridProps {
  features: LandingFeature[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <section className="relative -mt-6 px-6 pb-24 pt-32 bg-white rounded-t-4xl">
      <div className="max-w-6xl mx-auto" data-animate>
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance">
            Why travelers love
            <strong className="text-travel-primary"> Wayfinder</strong>
          </h2>
          <p className="text-xl text-gray-600 font-light text-pretty max-w-2xl mx-auto">
            Plan smarter with tools that understand the way you travel.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`group rounded-2xl shadow-lg border-0 backdrop-blur-sm ${feature.color}`}
                data-animate
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <Icon className="w-10 h-10 text-travel-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-pretty">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
