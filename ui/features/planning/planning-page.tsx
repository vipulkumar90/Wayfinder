"use client"

import { useRouter } from "next/navigation"

import { DestinationCards } from "./components/destination-cards"
import { PlannerForm } from "./components/planner-form"
import { PlannerHero } from "./components/planner-hero"
import { DESTINATION_CARDS, POPULAR_DESTINATIONS } from "./data"
import { usePlannerForm } from "./hooks/use-planner-form"

export function PlanningPage() {
  const router = useRouter()

  const planner = usePlannerForm({
    destinations: POPULAR_DESTINATIONS,
    onSubmit: ({ destination, budget, date }) => {
      const params = new URLSearchParams({
        destination,
        budget: String(budget),
        date: date ? date.toISOString() : "",
      })

      router.push(`/itinerary?${params.toString()}`)
    },
  })

  return (
    <div className="min-h-screen bg-travel-sky-light p-6">
      <div className="max-w-7xl mx-auto">
        <PlannerHero />
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <DestinationCards destinations={DESTINATION_CARDS} />
          <PlannerForm
            budget={planner.state.budget}
            date={planner.state.date}
            destination={planner.state.destination}
            suggestions={planner.state.suggestions}
            showSuggestions={planner.state.showSuggestions}
            inputRef={planner.refs.inputRef}
            dropdownRef={planner.refs.dropdownRef}
            onBudgetChange={planner.handlers.handleBudgetChange}
            onDateSelect={planner.actions.setDate}
            onDestinationChange={planner.actions.handleDestinationChange}
            onDestinationSelect={planner.actions.handleDestinationSelect}
            onSubmit={planner.handlers.handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
