"use client"

import { useEffect, useRef } from "react"

interface ScrollRevealOptions extends IntersectionObserverInit {
  selector?: string
  activeClassName?: string
}

export function useScrollReveal({
  selector = "[data-animate]",
  activeClassName = "animate-in",
  rootMargin,
  threshold = 0.15,
}: ScrollRevealOptions = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector))
    if (!elements.length) {
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(activeClassName)
          }
        })
      },
      {
        rootMargin,
        threshold,
      },
    )

    elements.forEach((element) => observerRef.current?.observe(element))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [selector, activeClassName, rootMargin, threshold])
}
