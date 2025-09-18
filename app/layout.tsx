import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { PWAInstall } from "@/components/pwa-install"
import "./globals.css"

export const metadata: Metadata = {
  title: "CleanAir Delhi-NCR",
  description: "Real-time air quality monitoring and forecasting for Delhi-NCR",
  generator: "CleanAir Delhi-NCR",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <PWAInstall />
        <Analytics />
      </body>
    </html>
  )
}
