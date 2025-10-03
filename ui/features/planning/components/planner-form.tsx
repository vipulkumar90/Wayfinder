"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { MutableRefObject } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface PlannerFormProps {
  budget: number
  date?: Date
  destination: string
  suggestions: string[]
  showSuggestions: boolean
  inputRef: MutableRefObject<HTMLInputElement | null>
  dropdownRef: MutableRefObject<HTMLDivElement | null>
  onBudgetChange: (value: number[]) => void
  onDateSelect: (date: Date | undefined) => void
  onDestinationChange: (value: string) => void
  onDestinationSelect: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function PlannerForm({
  budget,
  date,
  destination,
  suggestions,
  showSuggestions,
  inputRef,
  dropdownRef,
  onBudgetChange,
  onDateSelect,
  onDestinationChange,
  onDestinationSelect,
  onSubmit,
}: PlannerFormProps) {
  return (
    <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm" data-animate>
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-3 relative">
            <Label htmlFor="destination" className="text-lg font-medium text-gray-900">
              Destination
            </Label>
            <Input
              ref={inputRef}
              id="destination"
              placeholder="Where would you like to go?"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              onFocus={() => destination && onDestinationChange(destination)}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-20 mt-2 w-full rounded-xl bg-white py-2 shadow-lg border border-gray-100"
              >
                {suggestions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => onDestinationSelect(item)}
                    className="flex w-full items-start gap-2 px-4 py-2 text-left text-sm hover:bg-travel-sky-light"
                  >
                    <span className="font-medium text-gray-900">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-900">Budget</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Adjust your estimated travel budget</span>
              <Badge variant="outline" className="text-base px-3 py-1">
                €{budget.toLocaleString()}
              </Badge>
            </div>
            <Slider value={[budget]} min={500} max={10000} step={100} onValueChange={onBudgetChange} />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-900">Travel dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={onDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full h-12 rounded-full text-lg bg-travel-primary hover:bg-travel-secondary hover:text-black">
            Generate itinerary
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
