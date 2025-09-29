import Image from "next/image"

import { Card } from "@/components/ui/card"

import type { DestinationCard } from "../types"

interface DestinationCardsProps {
  destinations: DestinationCard[]
}

export function DestinationCards({ destinations }: DestinationCardsProps) {
  return (
    <div className="space-y-6" data-animate>
      {destinations.map((destination) => {
        const Icon = destination.icon
        return (
          <Card key={destination.title} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-bounce border-0">
            <div className="relative">
              <Image
                src={destination.image}
                alt={destination.title}
                width={640}
                height={256}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute bottom-6 left-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <h3 className="text-2xl font-semibold">{destination.title}</h3>
                </div>
                <p className="text-white/90 text-sm max-w-xs">{destination.description}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
