import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Wayfinder",
    template: "%s | Wayfinder",
  },
  description: "Wayfinder helps you plan immersive trips with itineraries, budgets, and curated recommendations.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
