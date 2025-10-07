import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { ICONS } from "../data"
import type { MapPlace } from "../types"

interface InteractiveMapCardProps {
  places: MapPlace[]
}

export function InteractiveMapCard({ places }: InteractiveMapCardProps) {
  const { Plus, Heart } = ICONS

  return (
    <Card className="rounded-2xl shadow-lg border-0 overflow-hidden" data-animate>
      <CardContent className="p-0">
        <div className="relative h-96 bg-travel-beige-light">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              <path d="M0,150 Q100,120 200,150 T400,140" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <path d="M150,0 Q180,100 150,200 T160,300" stroke="#94a3b8" strokeWidth="2" fill="none" />
              <ellipse cx="80" cy="80" rx="40" ry="25" fill="#bfdbfe" opacity="0.6" />
              <ellipse cx="320" cy="220" rx="50" ry="30" fill="#bfdbfe" opacity="0.6" />
            </svg>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 bg-travel-sky rounded-full border-4 border-white shadow-lg animate-pulse" />
              <div className="absolute -inset-2 bg-travel-sky/20 rounded-full animate-ping" />
            </div>
          </div>

          {places.map((place, index) => (
            <div
              key={place.id}
              className={`absolute ${index === 0 ? "top-1/4 right-1/4" : index === 1 ? "bottom-1/4 left-1/4" : "top-3/4 right-1/3"}`}
            >
              <div className="relative group">
                <div className="w-4 h-4 bg-travel-green rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform" />

                <Card className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 rounded-lg shadow-xl border-0">
                  <CardContent className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm">{place.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{place.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-travel-sky font-medium">{place.distance}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 rounded-full bg-transparent">
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 rounded-full bg-transparent">
                          <Heart className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <svg
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{
                    width: index === 0 ? "120px" : index === 1 ? "150px" : "100px",
                    height: index === 0 ? "80px" : index === 1 ? "120px" : "60px",
                    transform:
                      index === 0 ? "translate(-60px, -40px)" : index === 1 ? "translate(-75px, -60px)" : "translate(-50px, -30px)",
                  }}
                >
                  <path
                    d={index === 0 ? "M60,40 Q90,20 120,80" : index === 1 ? "M75,60 Q100,90 150,120" : "M50,30 Q75,15 100,60"}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          ))}

          <div className="absolute top-1/3 right-1/3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-travel-green shadow-sm">
            3km
          </div>
          <div className="absolute bottom-1/3 left-1/3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-travel-green shadow-sm">
            5km
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
