import Link from "next/link"
import { Wind } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">CleanAir Delhi-NCR</span>
        </div>
        <nav className="flex gap-6 text-muted-foreground text-sm">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/source-map" className="hover:text-primary transition-colors">Source Map</Link>
          <Link href="/forecast" className="hover:text-primary transition-colors">Forecast</Link>
          <Link href="/citizen" className="hover:text-primary transition-colors">Citizen</Link>
          <Link href="/mobile" className="hover:text-primary transition-colors">Mobile</Link>
          <Link href="/policy" className="hover:text-primary transition-colors">Policy</Link>
        </nav>
        <div className="flex gap-4 items-center">
          <a href="https://github.com/abhishree-k/Air-pollution-dashboard" target="_blank" rel="noopener" className="hover:text-primary text-muted-foreground">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5"><path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.37-1.342-3.37-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.646.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.188 22 16.437 22 12.012 22 6.484 17.523 2 12 2z"/></svg>
          </a>
          <a href="mailto:support@cleanair.com" className="hover:text-primary text-muted-foreground">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5"><path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 3 6.01V6h18z"/></svg>
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground py-2 border-t border-border">
        &copy; {new Date().getFullYear()} CleanAir Delhi-NCR. All rights reserved.
      </div>
    </footer>
  )
}
