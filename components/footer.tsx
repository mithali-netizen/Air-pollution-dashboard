"use client";
import React, { useEffect, useState, useRef, JSX } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered fade-in + slide-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Motion variants for tech stack items
  const techVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  const techStack = [
    "Next.js · React · TypeScript",
    "Tailwind · shadcn/ui · Framer Motion",
    "PWA (Service Worker, Push, Offline)",
    "APIs: OpenWeather · IoT · Satellite (MODIS/VIIRS)",
    "Hosting: Vercel · Firebase (optional)",
  ];

  return (
    <footer
      ref={footerRef}
      aria-label="Site Footer"
      className={`
        bg-gray-900 text-gray-200 dark:bg-gray-950 dark:text-gray-300
        transform transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left: About */}
          <div>
            <h3 className="text-xl font-semibold text-white dark:text-gray-100">
              CleanAir — Delhi NCR
            </h3>
            <p className="mt-2 text-sm text-gray-300 dark:text-gray-400 max-w-md">
              PWA for real-time air quality monitoring, AI forecasting, and policy feedback.
              Built for Smart India Hackathon (SIH).
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-2 py-1 rounded-md transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2l2.39 4.85L20 8.27l-4 3.89L17.8 20 12 16.9 6.2 20 8 12.16 4 8.27l5.61-.42L12 2z" />
                </svg>
                <span className="text-sm font-medium">SIH 2025 — Winner</span>
              </div>
            </div>
          </div>

          {/* Middle: Tech Stack */}
          <div>
            <h4 className="text-md font-semibold text-white dark:text-gray-100">Tech Stack</h4>
            <ul className="mt-3 text-sm text-gray-300 dark:text-gray-400 space-y-1">
              <AnimatePresence>
                {techStack.map((item, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={techVariants}
                  >
                    {item}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* Right: Links & Contact */}
          <div>
            <h4 className="text-md font-semibold text-white dark:text-gray-100">Team & Links</h4>
            <p className="text-sm text-gray-300 dark:text-gray-400 mt-2">
              Team: <span className="font-medium">YOUR_TEAM_NAME</span>
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                href="https://github.com/YOUR_USERNAME/YOUR_REPO"
                className="hover:underline hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              >
                GitHub Repo
              </Link>
              <Link
                href="https://YOUR_PROJECT.web.app"
                className="hover:underline hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              >
                Live
              </Link>
              <a
                href="mailto:YOUR_EMAIL"
                className="hover:underline hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              >
                Contact: YOUR_EMAIL
              </a>
            </div>

            {/* Extra: Social Icons */}
            <div className="mt-4 flex gap-3">
              <a href="https://twitter.com/YOUR_TWITTER" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-10h3v10zm-1.5-11.3a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm13.5 11.3h-3v-5.5c0-1.33-.03-3-1.82-3-1.82 0-2.1 1.42-2.1 2.89v5.61h-3v-10h2.88v1.37h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.58z" />
                </svg>
              </a>
            </div>

            <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
              <div>© {new Date().getFullYear()} CleanAir Project</div>
              <div>Data sources: OpenWeather • Mock IoT • MODIS/VIIRS</div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 dark:border-gray-700 pt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Built with ♥ for the Smart India Hackathon — open source under MIT.
        </div>
      </div>
    </footer>
  );
}
