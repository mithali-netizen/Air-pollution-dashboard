"use client";
import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense, useEffect, useState } from "react";
import { PWAInstall } from "@/components/pwa-install";
import Footer from "@/components/footer"; // make sure path matches
import "./globals.css";

// --- Removed metadata and viewport exports ---
// export const metadata: Metadata = { ... };
// export const viewport: Viewport = { ... };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerVisible, setFooterVisible] = useState(false);

  // Trigger footer, PWAInstall & Analytics fade-in + slide-up after mount
  useEffect(() => {
    const timer = setTimeout(() => setFooterVisible(true), 100); // small delay
    return () => clearTimeout(timer);
  }, []);

  const animationClasses = footerVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-6";

  return (
    <html lang="en" className="dark">
      <body
        className={`min-h-screen flex flex-col font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        {/* Main content grows to push footer down */}
        <main className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>

        {/* PWA + Analytics with animation */}
        <div
          className={`transition-all duration-700 ease-out transform ${animationClasses}`}
        >
          <PWAInstall />
        </div>
        <div
          className={`transition-all duration-700 ease-out transform ${animationClasses} mt-2`}
        >
          <Analytics />
        </div>

        {/* Footer — always at bottom with fade-in + slide-up */}
        <div
          className={`transition-all duration-700 ease-out transform ${animationClasses} mt-4`}
        >
          <Footer />
        </div>
      </body>
    </html>
  );
}
