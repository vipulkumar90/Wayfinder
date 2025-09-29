import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { ICONS } from "../data"
import type { RecommendedPlace } from "../types"

interface RecommendedPlacesGridProps {
  places: RecommendedPlace[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
}

export function RecommendedPlacesGrid({ places, favorites, onToggleFavorite }: RecommendedPlacesGridProps) {
  const { Heart, Plus, Star } = ICONS

  return (
    <Card className="rounded-2xl shadow-lg border-0" data-animate>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Places</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {places.map((place) => (
            <Card
              key={place.id}
              className="rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-0 overflow-hidden"
            >
              <div className="relative h-24">
                <Image src={place.image} alt={place.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                    onClick={() => onToggleFavorite(place.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.has(place.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white">
                    <Plus className="w-4 h-4 text-travel-sky" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-gray-900 text-sm">{place.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" className="text-xs">
                    {place.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{place.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
