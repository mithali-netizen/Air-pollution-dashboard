"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { fetchDelhiAQI, type ProcessedAQIData } from "@/lib/api"
import {
  Wind,
  MapPin,
  Clock,
  TrendingUp,
  Navigation,
  Bell,
  Shield,
  Activity,
  Heart,
  Blinds as Lungs,
  Eye,
} from "lucide-react"
import { NotificationSettings } from "@/components/notification-settings"

export default function CitizenPage() {
  const [aqiData, setAqiData] = useState<ProcessedAQIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    loadAQIData()
    const interval = setInterval(loadAQIData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const loadAQIData = async () => {
    try {
      const data = await fetchDelhiAQI()
      setAqiData(data)
    } catch (error) {
      console.error("Failed to load AQI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")
    }
  }

  const getHealthImpacts = (aqi: number) => {
    if (aqi <= 50) {
      return [
        { icon: Heart, text: "No health impacts expected", severity: "low" },
        { icon: Lungs, text: "Safe for all outdoor activities", severity: "low" },
        { icon: Eye, text: "No eye or throat irritation", severity: "low" },
      ]
    }
    if (aqi <= 100) {
      return [
        { icon: Heart, text: "Minimal impact for healthy individuals", severity: "moderate" },
        { icon: Lungs, text: "Sensitive people may experience minor symptoms", severity: "moderate" },
        { icon: Eye, text: "Possible minor eye irritation", severity: "moderate" },
      ]
    }
    if (aqi <= 150) {
      return [
        { icon: Heart, text: "Increased risk for heart patients", severity: "high" },
        { icon: Lungs, text: "Breathing difficulties for sensitive groups", severity: "high" },
        { icon: Eye, text: "Eye and throat irritation likely", severity: "high" },
      ]
    }
    if (aqi <= 200) {
      return [
        { icon: Heart, text: "Cardiovascular stress for everyone", severity: "very-high" },
        { icon: Lungs, text: "Respiratory symptoms for all", severity: "very-high" },
        { icon: Eye, text: "Significant eye and throat irritation", severity: "very-high" },
      ]
    }
    return [
      { icon: Heart, text: "Serious cardiovascular risks", severity: "hazardous" },
      { icon: Lungs, text: "Severe respiratory distress", severity: "hazardous" },
      { icon: Eye, text: "Intense eye and throat irritation", severity: "hazardous" },
    ]
  }

  const getSafetyRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return [
        "Perfect day for outdoor exercise and activities",
        "Windows can be kept open for natural ventilation",
        "No special precautions needed",
      ]
    }
    if (aqi <= 100) {
      return [
        "Limit prolonged outdoor activities if you're sensitive",
        "Consider closing windows during peak pollution hours",
        "Monitor symptoms if you have respiratory conditions",
      ]
    }
    if (aqi <= 150) {
      return [
        "Wear N95 masks when going outdoors",
        "Limit outdoor exercise, especially for children and elderly",
        "Keep windows closed and use air purifiers indoors",
        "Avoid outdoor activities during peak traffic hours",
      ]
    }
    if (aqi <= 200) {
      return [
        "Mandatory N95 masks for all outdoor activities",
        "Avoid all outdoor exercise and sports",
        "Stay indoors as much as possible",
        "Use air purifiers and keep all windows closed",
      ]
    }
    return [
      "Emergency conditions - stay indoors at all times",
      "Use high-quality air purifiers continuously",
      "Seek medical attention if experiencing symptoms",
      "Avoid all unnecessary outdoor exposure",
    ]
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-success"
      case "moderate":
        return "text-warning"
      case "high":
        return "text-orange-500"
      case "very-high":
        return "text-destructive"
      case "hazardous":
        return "text-red-700"
      default:
        return "text-muted-foreground"
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

  const healthImpacts = aqiData ? getHealthImpacts(aqiData.aqi) : []
  const safetyRecommendations = aqiData ? getSafetyRecommendations(aqiData.aqi) : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Citizen Health Dashboard</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Personalized air quality insights and health recommendations for Delhi-NCR residents
          </p>
        </div>

        {aqiData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current AQI Status */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Current Air Quality Status
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={notificationsEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={enableNotifications}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      {notificationsEnabled ? "Alerts On" : "Enable Alerts"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadAQIData}>
                      <Clock className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Real-time air quality data for {aqiData.location} • Last updated:{" "}
                  {new Date(aqiData.lastUpdated).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-6xl font-bold mb-2 text-foreground">{aqiData.aqi}</div>
                    <Badge
                      variant="secondary"
                      className={`text-lg px-3 py-1 ${aqiData.color.replace("text-", "bg-")} text-background`}
                    >
                      {aqiData.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Primary Pollutant</p>
                    <p className="text-2xl font-semibold">{aqiData.mainPollutant}</p>
                    <Progress value={(aqiData.aqi / 500) * 100} className="w-32 mt-2" />
                  </div>
                </div>

                {/* Detailed Pollutant Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Pollutant Concentrations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(aqiData.pollutants).map(([pollutant, value]) => (
                      <div key={pollutant} className="bg-muted rounded-lg p-3">
                        <p className="text-sm font-medium text-muted-foreground">{pollutant.toUpperCase()}</p>
                        <p className="text-lg font-semibold">{value} µg/m³</p>
                        <Progress
                          value={Math.min((value / (pollutant === "pm25" ? 250 : 500)) * 100, 100)}
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Clean Routes
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View 24h Forecast
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Guidelines
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Wind className="h-4 w-4 mr-2" />
                  Nearby Stations
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Notification Settings Card */}
        <div className="mb-8">
          <NotificationSettings />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Health Impact Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                Health Impact Assessment
              </CardTitle>
              <CardDescription>How current air quality may affect your health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthImpacts.map((impact, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <impact.icon className={`h-5 w-5 ${getSeverityColor(impact.severity)}`} />
                    <span className="text-sm">{impact.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Safety Recommendations
              </CardTitle>
              <CardDescription>Personalized advice based on current conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {safetyRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Safe Route Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Safe Route Suggestions
            </CardTitle>
            <CardDescription>AI-powered route recommendations for cleaner air exposure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Route A: Via Ring Road</h4>
                  <Badge variant="outline" className="bg-success text-success-foreground">
                    Clean
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Avoids high-traffic areas, passes through green corridors
                </p>
                <div className="flex justify-between text-sm">
                  <span>Distance: 12.5 km</span>
                  <span>Est. AQI: 85</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Route B: Metro + Walk</h4>
                  <Badge variant="outline" className="bg-warning text-warning-foreground">
                    Moderate
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Underground metro reduces exposure time</p>
                <div className="flex justify-between text-sm">
                  <span>Distance: 8.2 km</span>
                  <span>Est. AQI: 120</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Route C: Direct Road</h4>
                  <Badge variant="outline" className="bg-destructive text-destructive-foreground">
                    Avoid
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">High traffic, industrial areas on route</p>
                <div className="flex justify-between text-sm">
                  <span>Distance: 9.8 km</span>
                  <span>Est. AQI: 180</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Get Detailed Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
