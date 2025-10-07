import { Card, CardContent } from "@/components/ui/card"

import { ICONS } from "../data"
import type { TripSummary } from "../types"

interface ItinerarySummaryCardProps {
  summary: TripSummary
}

export function ItinerarySummaryCard({ summary }: ItinerarySummaryCardProps) {
  const { MapPin, Calendar, Euro } = ICONS

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-travel-beige-light" data-animate>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-travel-sky" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{summary.destination}</h1>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{summary.dateRange}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-travel-green font-semibold text-xl">
            <Euro className="w-5 h-5" />
            {summary.budget}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
