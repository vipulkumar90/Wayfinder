"use client"

import type { DragEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ICONS } from "../data"
import type { ItineraryEvent } from "../types"

interface ItineraryTimelineProps {
  dayLabel: string
  events: ItineraryEvent[]
  draggedEventId: string | null
  editingEventId: string | null
  tempTime: string
  disablePrev: boolean
  disableNext: boolean
  onPrev: () => void
  onNext: () => void
  onStartEditing: (eventId: string, currentTime: string) => void
  onTempTimeChange: (value: string) => void
  onSaveTime: () => void
  onCancelEdit: () => void
  onDragStart: (eventId: string) => void
  onDrop: (targetEventId: string) => void
  onDragEnd: () => void
}

export function ItineraryTimeline({
  dayLabel,
  events,
  draggedEventId,
  editingEventId,
  tempTime,
  disablePrev,
  disableNext,
  onPrev,
  onNext,
  onStartEditing,
  onTempTimeChange,
  onSaveTime,
  onCancelEdit,
  onDragStart,
  onDrop,
  onDragEnd,
}: ItineraryTimelineProps) {
  const { ChevronLeft, ChevronRight, Calendar, GripVertical, Clock, Check, X } = ICONS

  const handleDragStart = (event: DragEvent<HTMLDivElement>, eventId: string) => {
    onDragStart(eventId)
    event.dataTransfer.effectAllowed = "move"
    const rect = event.currentTarget.getBoundingClientRect()
    event.dataTransfer.setDragImage(event.currentTarget, rect.width / 2, rect.height / 2)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetEventId: string) => {
    event.preventDefault()
    onDrop(targetEventId)
  }

  return (
    <Card className="rounded-2xl shadow-lg border-0" data-animate>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent hover:bg-travel-sky-light"
              onClick={onPrev}
              disabled={disablePrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-travel-sky" />
              {dayLabel}
            </h2>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent hover:bg-travel-sky-light"
              onClick={onNext}
              disabled={disableNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 relative">
          {events.map((event, index) => {
            const Icon = event.icon

            return (
              <div key={event.id} className="relative">
                {index > 0 && (
                  <div className="absolute left-[37px] -top-3 w-0.5 h-3 flex items-center">
                    <div className="w-px h-full border-l border-dashed border-travel-sky opacity-40" />
                    {event.distance && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
                        {event.distance}
                      </div>
                    )}
                  </div>
                )}

                <div
                  draggable
                  onDragStart={(dragEvent) => handleDragStart(dragEvent, event.id)}
                  onDragOver={handleDragOver}
                  onDrop={(dragEvent) => handleDrop(dragEvent, event.id)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 cursor-move transition-all duration-200 ${
                    draggedEventId === event.id ? "opacity-50" : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-travel-sky-light">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      {editingEventId === event.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={tempTime}
                            onChange={(e) => onTempTimeChange(e.target.value)}
                            className="h-6 w-20 text-xs border-travel-sky"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                            onClick={onSaveTime}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={onCancelEdit}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-travel-sky-light transition-colors"
                          onClick={() => onStartEditing(event.id, event.time)}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
