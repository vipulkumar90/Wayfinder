import type { LucideIcon } from "lucide-react"

export interface ItineraryEvent {
  id: string
  type: "flight" | "travel" | "hotel" | "event" | "food" | "park"
  title: string
  time: string
  icon: LucideIcon
  distance?: string
}

export interface ItineraryDay {
  date: string
  events: ItineraryEvent[]
}

export interface TripSummary {
  destination: string
  dateRange: string
  budget: string
}

export interface RecommendedPlace {
  id: string
  title: string
  image: string
  rating: number
  category: string
}

export interface MapPlace {
  id: string
  title: string
  description: string
  distance: string
  type: string
}
