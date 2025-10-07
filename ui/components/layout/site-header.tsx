"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface SiteHeaderProps {
  registerLabel?: string;
  registerHref?: string;
  loginLabel?: string;
  loginHref?: string;
  transparent?: boolean;
}

const SCROLL_THRESHOLD = 12;

export function SiteHeader({
  registerLabel = "Sign Up",
  registerHref = "/register",
  loginLabel = "Log In",
  loginHref = "/login",
  transparent = false,
}: SiteHeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const updateVisibility = () => {
        const currentY = window.scrollY;
        const lastY = lastScrollYRef.current;
        const delta = currentY - lastY;

        lastScrollYRef.current = currentY;
        tickingRef.current = false;

        if (currentY <= 0) {
          setIsHidden(false);
          return;
        }

        if (Math.abs(delta) < SCROLL_THRESHOLD) {
          return;
        }

        if (delta > 0) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      };

      if (!tickingRef.current) {
        window.requestAnimationFrame(updateVisibility);
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const backgroundClass = transparent
    ? "bg-white/50 backdrop-blur-sm"
    : "bg-white";
  const transformClass = isHidden ? "-translate-y-full" : "translate-y-0";

  return (
    <header
      className={`sticky top-0 z-30 flex w-full justify-center px-4 py-5 transition-transform duration-300 ease-out ${backgroundClass} ${transformClass}`}
    >
      <div className="flex w-full max-w-[70vw] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/wayfinder-logo.svg"
            alt="Wayfinder"
            width={140}
            height={60}
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border border-travel-primary px-6 py-2 text-travel-primary transition-colors hover:bg-travel-primary/20 hover:text-travel-primary"
          >
            <Link href={loginHref}>{loginLabel}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-xl px-6 py-3 text-white transition-colors bg-travel-primary hover:bg-travel-primary/80 hover:text-white"
          >
            <Link href={registerHref}>{registerLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
