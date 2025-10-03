import type { LucideIcon } from "lucide-react";

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface DestinationHighlight {
  name: string;
  tagline: string;
  image: string;
}

export interface TravelStat {
  label: string;
  value: string;
}
