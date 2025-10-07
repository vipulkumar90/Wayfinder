import type { LucideIcon } from "lucide-react"

export interface DestinationCard {
  title: string
  description: string
  image: string
  icon: LucideIcon
}

export interface PlannerPayload {
  destination: string
  budget: number
  date?: Date
}
