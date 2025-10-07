"use client"

import { useMemo, useState } from "react"

import { INITIAL_ITINERARY } from "../data"
import type { ItineraryDay } from "../types"

interface UseItineraryOptions {
  initialDays?: ItineraryDay[]
}

export function useItinerary({ initialDays = INITIAL_ITINERARY }: UseItineraryOptions = {}) {
  const [days, setDays] = useState<ItineraryDay[]>(initialDays)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [tempTime, setTempTime] = useState("")

  const currentDay = days[currentDayIndex]

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) {
      return currentDay?.events ?? []
    }

    const term = searchQuery.toLowerCase()
    return (currentDay?.events ?? []).filter((event) => event.title.toLowerCase().includes(term))
  }, [currentDay, searchQuery])

  const goToPreviousDay = () => {
    setCurrentDayIndex((index) => Math.max(index - 1, 0))
  }

  const goToNextDay = () => {
    setCurrentDayIndex((index) => Math.min(index + 1, days.length - 1))
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev)
      if (updated.has(id)) {
        updated.delete(id)
      } else {
        updated.add(id)
      }
      return updated
    })
  }

  const startEditingTime = (eventId: string, currentTime: string) => {
    setEditingEventId(eventId)
    setTempTime(currentTime)
  }

  const cancelTimeEdit = () => {
    setEditingEventId(null)
    setTempTime("")
  }

  const saveTimeEdit = () => {
    if (!editingEventId || !tempTime) return

    setDays((prevDays) => {
      const updatedDays = prevDays.map((day, index) => {
        if (index !== currentDayIndex) return day
        return {
          ...day,
          events: day.events.map((event) => (event.id === editingEventId ? { ...event, time: tempTime } : event)),
        }
      })

      return updatedDays
    })

    setEditingEventId(null)
    setTempTime("")
  }

  const handleDragStart = (eventId: string) => {
    setDraggedEventId(eventId)
  }

  const handleDragEnd = () => {
    setDraggedEventId(null)
  }

  const handleReorder = (targetEventId: string) => {
    if (!draggedEventId || draggedEventId === targetEventId) {
      handleDragEnd()
      return
    }

    setDays((prevDays) => {
      const updatedDays = prevDays.map((day, index) => {
        if (index !== currentDayIndex) {
          return day
        }

        const events = day.events.map((item) => ({ ...item }))
        const draggedIndex = events.findIndex((item) => item.id === draggedEventId)
        const targetIndex = events.findIndex((item) => item.id === targetEventId)

        if (draggedIndex === -1 || targetIndex === -1) {
          return day
        }

        const [draggedEvent] = events.splice(draggedIndex, 1)
        const targetEvent = events[targetIndex]

        if (draggedEvent.time && targetEvent.time) {
          const targetTime = targetEvent.time
          targetEvent.time = draggedEvent.time
          draggedEvent.time = targetTime
        }

        events.splice(targetIndex, 0, draggedEvent)

        return {
          ...day,
          events,
        }
      })

      return updatedDays
    })

    handleDragEnd()
  }

  return {
    days,
    currentDay,
    currentDayIndex,
    favorites,
    searchQuery,
    draggedEventId,
    editingEventId,
    tempTime,
    filteredEvents,
    actions: {
      setSearchQuery,
      goToPreviousDay,
      goToNextDay,
      toggleFavorite,
      startEditingTime,
      cancelTimeEdit,
      setTempTime,
      saveTimeEdit,
      handleDragStart,
      handleReorder,
      handleDragEnd,
    },
  }
}
