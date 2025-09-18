"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchMonitoringStations } from "@/lib/api"
import { MapPin, Factory, Car, Flame, Wind, Filter, RefreshCw } from "lucide-react"

interface MonitoringStation {
  id: string
  name: string
  latitude: number
  longitude: number
  aqi: number
  status: string
  color: string
}

interface PollutionSource {
  id: string
  name: string
  type: "traffic" | "industry" | "stubble" | "construction"
  latitude: number
  longitude: number
  contribution: number
  severity: "low" | "moderate" | "high" | "very-high"
}

export default function SourceMapPage() {
  const [stations, setStations] = useState<MonitoringStation[]>([])
  const [sources, setSources] = useState<PollutionSource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const [mapCenter] = useState({ lat: 28.6139, lng: 77.209 }) // Delhi center

  useEffect(() => {
    loadMapData()
  }, [])

  const loadMapData = async () => {
    try {
      const stationsData = await fetchMonitoringStations()
      setStations(stationsData)

      // Generate mock pollution sources
      const mockSources: PollutionSource[] = [
        {
          id: "traffic-1",
          name: "Ring Road Traffic",
          type: "traffic",
          latitude: 28.6304,
          longitude: 77.2177,
          contribution: 35,
          severity: "high",
        },
        {
          id: "industry-1",
          name: "Industrial Area Mayapuri",
          type: "industry",
          latitude: 28.6469,
          longitude: 77.1394,
          contribution: 28,
          severity: "very-high",
        },
        {
          id: "stubble-1",
          name: "Agricultural Burning (Haryana)",
          type: "stubble",
          latitude: 28.7041,
          longitude: 77.1025,
          contribution: 22,
          severity: "high",
        },
        {
          id: "construction-1",
          name: "Construction Sites (Gurgaon)",
          type: "construction",
          latitude: 28.4595,
          longitude: 77.0266,
          contribution: 15,
          severity: "moderate",
        },
        {
          id: "traffic-2",
          name: "Delhi-Noida Expressway",
          type: "traffic",
          latitude: 28.5355,
          longitude: 77.391,
          contribution: 30,
          severity: "high",
        },
        {
          id: "industry-2",
          name: "Okhla Industrial Area",
          type: "industry",
          latitude: 28.5244,
          longitude: 77.2952,
          contribution: 25,
          severity: "high",
        },
      ]
      setSources(mockSources)
    } catch (error) {
      console.error("Failed to load map data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSourceIcon = (type: PollutionSource["type"]) => {
    switch (type) {
      case "traffic":
        return Car
      case "industry":
        return Factory
      case "stubble":
        return Flame
      case "construction":
        return Factory
      default:
        return MapPin
    }
  }

  const getSourceColor = (severity: PollutionSource["severity"]) => {
    switch (severity) {
      case "low":
        return "text-success"
      case "moderate":
        return "text-warning"
      case "high":
        return "text-orange-500"
      case "very-high":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadge = (severity: PollutionSource["severity"]) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-success text-success-foreground">Low Impact</Badge>
      case "moderate":
        return <Badge className="bg-warning text-warning-foreground">Moderate</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white">High Impact</Badge>
      case "very-high":
        return <Badge className="bg-destructive text-destructive-foreground">Very High</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Pollution Source Map</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Real-time monitoring stations and pollution source identification across Delhi-NCR
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Interactive Pollution Map
                </CardTitle>
                <Button variant="outline" size="sm" onClick={loadMapData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
              <CardDescription>Click on stations and sources to view detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mock Map Interface */}
              <div className="bg-muted rounded-lg h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20"></div>

                {/* Monitoring Stations */}
                {stations.slice(0, 8).map((station, index) => (
                  <div
                    key={station.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-125 ${
                      station.aqi <= 50
                        ? "bg-success"
                        : station.aqi <= 100
                          ? "bg-warning"
                          : station.aqi <= 150
                            ? "bg-orange-500"
                            : station.aqi <= 200
                              ? "bg-destructive"
                              : "bg-red-700"
                    }`}
                    style={{
                      left: `${20 + (index % 4) * 20}%`,
                      top: `${20 + Math.floor(index / 4) * 30}%`,
                    }}
                    onClick={() => setSelectedStation(station)}
                    title={`${station.name}: AQI ${station.aqi}`}
                  />
                ))}

                {/* Pollution Sources */}
                {sources.map((source, index) => {
                  const Icon = getSourceIcon(source.type)
                  return (
                    <div
                      key={source.id}
                      className={`absolute cursor-pointer transition-all hover:scale-110 ${getSourceColor(
                        source.severity,
                      )}`}
                      style={{
                        left: `${15 + (index % 3) * 25}%`,
                        top: `${40 + Math.floor(index / 3) * 20}%`,
                      }}
                      title={`${source.name}: ${source.contribution}% contribution`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  )
                })}

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span>Good (0-50)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span>Moderate (51-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span>Unhealthy (101+)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Station Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStation ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedStation.name}</h3>
                    <p className="text-sm text-muted-foreground">Monitoring Station</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{selectedStation.aqi}</span>
                    <Badge
                      className={`${selectedStation.color.replace("text-", "bg-")} text-background`}
                      variant="secondary"
                    >
                      {selectedStation.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Location:</span>
                      <span className="text-sm font-medium">
                        {selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Updated:</span>
                      <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Click on a monitoring station to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pollution Sources Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Major Pollution Sources
              </CardTitle>
              <CardDescription>Identified contributors to air pollution in Delhi-NCR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sources
                  .sort((a, b) => b.contribution - a.contribution)
                  .map((source) => {
                    const Icon = getSourceIcon(source.type)
                    return (
                      <div key={source.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${getSourceColor(source.severity)}`} />
                          <div>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{source.type} source</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{source.contribution}%</p>
                          {getSeverityBadge(source.severity)}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Source Type Breakdown
              </CardTitle>
              <CardDescription>Contribution by pollution source category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Traffic", percentage: 42, color: "bg-destructive", icon: Car },
                  { type: "Industrial", percentage: 31, color: "bg-orange-500", icon: Factory },
                  { type: "Agricultural Burning", percentage: 18, color: "bg-warning", icon: Flame },
                  { type: "Construction", percentage: 9, color: "bg-success", icon: Factory },
                ].map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <span className="font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Stations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              All Monitoring Stations
            </CardTitle>
            <CardDescription>
              Real-time data from {stations.length} monitoring stations across Delhi-NCR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="p-4 bg-muted rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold truncate">{station.name}</h4>
                    <Badge className={`${station.color.replace("text-", "bg-")} text-background`} variant="secondary">
                      {station.aqi}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{station.status}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {station.latitude.toFixed(3)}, {station.longitude.toFixed(3)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
