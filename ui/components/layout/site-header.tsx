"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
  loginLabel?: string
  loginHref?: string
  onLoginClick?: () => void
  transparent?: boolean
}

const SCROLL_THRESHOLD = 12

export function SiteHeader({
  ctaLabel = "Sign Up",
  ctaHref,
  onCtaClick,
  loginLabel = "Log In",
  loginHref = "/login",
  onLoginClick,
  transparent = false,
}: SiteHeaderProps) {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const updateVisibility = () => {
        const currentY = window.scrollY
        const lastY = lastScrollYRef.current
        const delta = currentY - lastY

        lastScrollYRef.current = currentY
        tickingRef.current = false

        if (currentY <= 0) {
          setIsHidden(false)
          return
        }

        if (Math.abs(delta) < SCROLL_THRESHOLD) {
          return
        }

        if (delta > 0) {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
      }

      if (!tickingRef.current) {
        window.requestAnimationFrame(updateVisibility)
        tickingRef.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const backgroundClass = transparent ? "bg-white/50 backdrop-blur-sm" : "bg-white"
  const transformClass = isHidden ? "-translate-y-full" : "translate-y-0"

  return (
    <header
      className={`sticky top-0 z-30 flex w-full justify-center px-4 py-5 transition-transform duration-300 ease-out ${backgroundClass} ${transformClass}`}
    >
      <div className="flex w-full max-w-[70vw] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/wayfinder-logo.svg" alt="Wayfinder" width={120} height={60} priority />
        </Link>
        <div className="flex items-center gap-3">
          {(loginHref || onLoginClick) &&
            (loginHref && !onLoginClick ? (
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-2 border-travel-primary px-5 py-2 text-travel-primary transition-colors hover:bg-travel-primary hover:text-white"
              >
                <Link href={loginHref}>{loginLabel}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-2xl border-2 border-travel-primary px-5 py-2 text-travel-primary transition-colors hover:bg-travel-primary hover:text-white"
                onClick={onLoginClick}
              >
                {loginLabel}
              </Button>
            ))}
          {ctaHref ? (
            <Button
              asChild
              variant="outline"
              className="rounded-2xl border-2 border-travel-primary px-6 py-2 text-travel-primary transition-colors hover:bg-travel-primary hover:text-white"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : (
            <Button
              className="rounded-2xl border-2 border-travel-primary bg-travel-primary px-6 py-3 text-white transition-colors hover:border-travel-primary/80 hover:bg-travel-primary/80"
              onClick={onCtaClick}
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
