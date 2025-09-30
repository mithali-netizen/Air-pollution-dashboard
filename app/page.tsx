"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchDelhiAQI, type ProcessedAQIData } from "@/lib/api"
import { Wind, MapPin, Clock, TrendingUp, AlertTriangle, Leaf } from "lucide-react"

export default function HomePage() {
  const [aqiData, setAqiData] = useState<ProcessedAQIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const router = useRouter()

  useEffect(() => {
    loadAQIData()
    const interval = setInterval(loadAQIData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const loadAQIData = async () => {
    try {
      const data = await fetchDelhiAQI()
      setAqiData(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to load AQI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthRecommendation = (aqi: number) => {
    if (aqi <= 50)
      return { text: "Air quality is good. Great day for outdoor activities!", icon: Leaf, color: "text-success" }
    if (aqi <= 100)
      return {
        text: "Air quality is moderate. Sensitive individuals should limit outdoor activities.",
        icon: Wind,
        color: "text-warning",
      }
    if (aqi <= 150)
      return {
        text: "Unhealthy for sensitive groups. Consider wearing a mask outdoors.",
        icon: AlertTriangle,
        color: "text-orange-500",
      }
    if (aqi <= 200)
      return {
        text: "Unhealthy air quality. Limit outdoor activities and wear a mask.",
        icon: AlertTriangle,
        color: "text-destructive",
      }
    if (aqi <= 300)
      return {
        text: "Very unhealthy. Avoid outdoor activities. Stay indoors.",
        icon: AlertTriangle,
        color: "text-purple-500",
      }
    return {
      text: "Hazardous air quality. Emergency conditions. Stay indoors with air purifiers.",
      icon: AlertTriangle,
      color: "text-red-700",
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const healthRec = aqiData ? getHealthRecommendation(aqiData.aqi) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Real-Time Air Quality Monitoring</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Stay informed about Delhi-NCR's air quality with live data and AI-powered insights
          </p>
        </div>

        {aqiData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main AQI Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {aqiData.location}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      Last updated: {new Date(aqiData.lastUpdated).toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadAQIData}>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div
                      className="text-6xl font-bold mb-2"
                      style={{ color: `hsl(var(--${aqiData.color.replace("text-", "")}))` }}
                    >
                      {aqiData.aqi}
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {aqiData.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Main Pollutant</p>
                    <p className="text-2xl font-semibold">{aqiData.mainPollutant}</p>
                  </div>
                </div>

                {/* Pollutant Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(aqiData.pollutants).map(([pollutant, value]) => (
                    <div key={pollutant} className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-medium text-muted-foreground">{pollutant.toUpperCase()}</p>
                      <p className="text-lg font-semibold">{value} µg/m³</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Alert Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Health Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthRec && (
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${healthRec.color}`}>
                      <healthRec.icon className="h-6 w-6" />
                      <span className="font-medium">Health Advisory</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{healthRec.text}</p>
                    <div className="pt-4 space-y-2">
                      <Button className="w-full bg-transparent" variant="outline" onClick={() => router.push('/forecast')}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Forecast
                      </Button>
                      <Button className="w-full bg-transparent" variant="outline" onClick={() => router.push('/mobile')}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Find Clean Routes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/source-map" className="hover:bg-accent transition-colors cursor-pointer rounded-xl">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Source Map</h3>
                <p className="text-sm text-muted-foreground">View pollution sources across Delhi-NCR</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/forecast" className="hover:bg-accent transition-colors cursor-pointer rounded-xl">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">AI Forecast</h3>
                <p className="text-sm text-muted-foreground">24-72 hour air quality predictions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/mobile" className="hover:bg-accent transition-colors cursor-pointer rounded-xl">
            <Card>
              <CardContent className="p-6 text-center">
                <Wind className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Safe Routes</h3>
                <p className="text-sm text-muted-foreground">Find cleaner paths for your journey</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/citizen" className="hover:bg-accent transition-colors cursor-pointer rounded-xl">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified of air quality changes</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
