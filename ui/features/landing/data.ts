import { Calendar, Compass, Heart, MapPin, Plane } from "lucide-react";

import type { DestinationHighlight, LandingFeature, TravelStat } from "./types";

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: Calendar,
    title: "Smart Itineraries",
    description:
      "Auto-generate daily travel plans with hotels, restaurants, and activities tailored to your preferences.",
    color: "bg-[#E6E3FF]",
  },
  {
    icon: MapPin,
    title: "Interactive Maps",
    description:
      "Explore destinations visually, find spots near you, and discover hidden gems with our interactive maps.",
    color: "bg-[#F3F3F3]",
  },
  {
    icon: Heart,
    title: "Seamless Planning",
    description:
      "Save favorites, manage budget, customize trips easily with our intuitive planning tools.",
    color: "bg-[#F2F0E0]",
  },
];

export const DESTINATION_HIGHLIGHTS: DestinationHighlight[] = [
  {
    name: "Tokyo",
    tagline: "Tradition meets Future",
    image: "/sensoji-temple-tokyo.jpg",
  },
  {
    name: "Paris",
    tagline: "City of Light & Love",
    image: "/paris-eiffel-tower-sunset.png",
  },
  {
    name: "New York",
    tagline: "The City That Never Sleeps",
    image: "/nyc-skyline.png",
  },
  {
    name: "Bali",
    tagline: "Island Paradise",
    image: "/tropical-beach-paradise-with-palm-trees-and-turquo.jpg",
  },
];

export const HERO_ICONS = {
  left: Compass,
  right: Plane,
};

export const TRAVEL_STATS: TravelStat[] = [
  { label: "Trips Planned", value: "25k+" },
  { label: "Destinations Covered", value: "120" },
  { label: "Hotels & Restaurants", value: "4.5k" },
  { label: "Community Reviews", value: "54k" },
];
