"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ICONS } from "../data"

interface PlacesSearchCardProps {
  query: string
  onQueryChange: (value: string) => void
}

export function PlacesSearchCard({ query, onQueryChange }: PlacesSearchCardProps) {
  const { Search } = ICONS

  return (
    <Card className="rounded-2xl shadow-lg border-0" data-animate>
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search a place"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="pl-10 h-12 rounded-full border-2 focus:border-travel-sky transition-colors"
          />
        </div>
      </CardContent>
    </Card>
  )
}
