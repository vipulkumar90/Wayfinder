"use client"

import { ItinerarySummaryCard } from "./components/itinerary-summary-card"
import { ItineraryTimeline } from "./components/itinerary-timeline"
import { InteractiveMapCard } from "./components/interactive-map-card"
import { PlacesSearchCard } from "./components/places-search-card"
import { RecommendedPlacesGrid } from "./components/recommended-places-grid"
import { INITIAL_ITINERARY, MAP_PLACES, RECOMMENDED_PLACES, TRIP_SUMMARY } from "./data"
import { useItinerary } from "./hooks/use-itinerary"

export function ItineraryPage() {
  const itinerary = useItinerary({ initialDays: INITIAL_ITINERARY })

  const searchTerm = itinerary.searchQuery.toLowerCase()

  const filteredPlaces = RECOMMENDED_PLACES.filter((place) =>
    searchTerm ? place.title.toLowerCase().includes(searchTerm) || place.category.toLowerCase().includes(searchTerm) : true,
  )

  const filteredMapPlaces = MAP_PLACES.filter((place) =>
    searchTerm ? place.title.toLowerCase().includes(searchTerm) || place.type.toLowerCase().includes(searchTerm) : true,
  )

  const placesToRender = filteredPlaces.length ? filteredPlaces : RECOMMENDED_PLACES
  const mapPlacesToRender = filteredMapPlaces.length ? filteredMapPlaces : MAP_PLACES

  const currentDay = itinerary.currentDay ?? itinerary.days[0]
  const events = currentDay?.events ?? []

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ItinerarySummaryCard summary={TRIP_SUMMARY} />
            <ItineraryTimeline
              dayLabel={currentDay?.date ?? ""}
              events={events}
              draggedEventId={itinerary.draggedEventId}
              editingEventId={itinerary.editingEventId}
              tempTime={itinerary.tempTime}
              disablePrev={itinerary.currentDayIndex === 0}
              disableNext={itinerary.currentDayIndex === itinerary.days.length - 1}
              onPrev={itinerary.actions.goToPreviousDay}
              onNext={itinerary.actions.goToNextDay}
              onStartEditing={itinerary.actions.startEditingTime}
              onTempTimeChange={itinerary.actions.setTempTime}
              onSaveTime={itinerary.actions.saveTimeEdit}
              onCancelEdit={itinerary.actions.cancelTimeEdit}
              onDragStart={itinerary.actions.handleDragStart}
              onDrop={itinerary.actions.handleReorder}
              onDragEnd={itinerary.actions.handleDragEnd}
            />
            <RecommendedPlacesGrid
              places={placesToRender}
              favorites={itinerary.favorites}
              onToggleFavorite={itinerary.actions.toggleFavorite}
            />
          </div>

          <div className="space-y-6">
            <PlacesSearchCard query={itinerary.searchQuery} onQueryChange={itinerary.actions.setSearchQuery} />
            <InteractiveMapCard places={mapPlacesToRender} />
          </div>
        </div>
      </div>
    </div>
  )
}
