import {
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Euro,
  GripVertical,
  Heart,
  Hotel,
  MapPin,
  Plane,
  Plus,
  Search,
  Star,
  TreePine,
  UtensilsCrossed,
  X,
} from "lucide-react"

import type { ItineraryDay, MapPlace, RecommendedPlace, TripSummary } from "./types"

export const INITIAL_ITINERARY: ItineraryDay[] = [
  {
    date: "Sunday, Oct 9, 2025",
    events: [
      { id: "1", type: "flight", title: "Flight Departure", time: "06:00", icon: Plane },
      { id: "2", type: "travel", title: "Airport Transfer", time: "14:30", icon: MapPin, distance: "45km, 1h" },
      { id: "3", type: "hotel", title: "Hotel Check-in", time: "16:00", icon: Hotel, distance: "2km, 15min" },
    ],
  },
  {
    date: "Monday, Oct 10, 2025",
    events: [
      { id: "4", type: "event", title: "Tokyo Tower", time: "09:00", icon: Camera, distance: "3km, 20min" },
      { id: "5", type: "food", title: "Sushi Lunch", time: "12:30", icon: UtensilsCrossed, distance: "1km, 5min" },
      { id: "6", type: "park", title: "Imperial Palace", time: "15:00", icon: TreePine, distance: "2km, 10min" },
    ],
  },
  {
    date: "Tuesday, Oct 11, 2025",
    events: [
      { id: "7", type: "flight", title: "Flight Arrival", time: "08:00", icon: Plane },
      { id: "8", type: "travel", title: "Airport Transfer", time: "09:30", icon: MapPin, distance: "45km, 1h" },
      { id: "9", type: "hotel", title: "Hotel Check-in", time: "11:00", icon: Hotel, distance: "2km, 15min" },
      { id: "10", type: "event", title: "Sensoji Temple", time: "14:00", icon: Camera, distance: "5km, 20min" },
      { id: "11", type: "food", title: "Ramen Dinner", time: "19:00", icon: UtensilsCrossed, distance: "1km, 5min" },
      { id: "12", type: "park", title: "Ueno Park", time: "21:00", icon: TreePine, distance: "3km, 15min" },
    ],
  },
  {
    date: "Wednesday, Oct 12, 2025",
    events: [
      { id: "13", type: "event", title: "Meiji Shrine", time: "10:00", icon: Camera, distance: "4km, 25min" },
      { id: "14", type: "food", title: "Traditional Tea", time: "13:00", icon: UtensilsCrossed, distance: "500m, 3min" },
      { id: "15", type: "flight", title: "Flight Departure", time: "18:00", icon: Plane, distance: "45km, 1h" },
    ],
  },
]

export const TRIP_SUMMARY: TripSummary = {
  destination: "Tokyo",
  dateRange: "Oct 9 - Oct 12, 2025",
  budget: "1500€",
}

export const RECOMMENDED_PLACES: RecommendedPlace[] = [
  { id: "rec1", title: "Sensoji Temple", image: "/sensoji-temple-tokyo.jpg", rating: 4.8, category: "Temple" },
  { id: "rec2", title: "Tokyo Skytree", image: "/tokyo-skytree-night.png", rating: 4.7, category: "Landmark" },
  { id: "rec3", title: "Tsukiji Market", image: "/tsukiji-fish-market.jpg", rating: 4.6, category: "Market" },
  { id: "rec4", title: "Meiji Shrine", image: "/meiji-shrine-tokyo.jpg", rating: 4.5, category: "Shrine" },
]

export const MAP_PLACES: MapPlace[] = [
  { id: "map1", title: "Yummy Restaurant", description: "Local Food, 4.5⭐", distance: "3km", type: "restaurant" },
  { id: "map2", title: "Grand Hotel", description: "Luxury Stay, 4.8⭐", distance: "5km", type: "hotel" },
  { id: "map3", title: "Art Museum", description: "Culture, 4.6⭐", distance: "2km", type: "museum" },
]

export const ICONS = {
  GripVertical,
  Clock,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Euro,
  Search,
  Plus,
  Heart,
  Star,
}
