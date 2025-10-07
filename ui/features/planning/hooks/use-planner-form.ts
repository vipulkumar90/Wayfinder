"use client"

import { useEffect, useRef, useState } from "react"

import type { PlannerPayload } from "../types"

interface UsePlannerFormOptions {
  destinations: string[]
  onSubmit: (payload: PlannerPayload) => void
}

export function usePlannerForm({ destinations, onSubmit }: UsePlannerFormOptions) {
  const [budget, setBudget] = useState(1500)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [destination, setDestination] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const updateSuggestions = (value: string) => {
    if (!value) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const matches = destinations
      .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 8)

    setSuggestions(matches)
    setShowSuggestions(matches.length > 0)
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    updateSuggestions(value)
  }

  const handleDestinationSelect = (value: string) => {
    setDestination(value)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ destination, budget, date })
  }

  const handleBudgetChange = (value: number[]) => {
    if (!value.length) return
    setBudget(value[0])
  }

  return {
    state: {
      budget,
      date,
      destination,
      suggestions,
      showSuggestions,
    },
    actions: {
      setDate,
      handleDestinationChange,
      handleDestinationSelect,
    },
    refs: {
      inputRef,
      dropdownRef,
    },
    handlers: {
      handleSubmit,
      handleBudgetChange,
    },
  }
}
