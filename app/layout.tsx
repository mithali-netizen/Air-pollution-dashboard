// Add "use client" as the very first line (already present)
// Ensure all imports are correct and only used in client components

"use client";
import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense, useEffect, useState } from "react";
import { PWAInstall } from "@/components/pwa-install";
import { Footer } from "@/components/footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFooterVisible(true), 100);
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
        <main className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
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
        <div
          className={`transition-all duration-700 ease-out transform ${animationClasses} mt-4`}
        >
          <Footer />
        </div>
      </body>
    </html>
  );
}