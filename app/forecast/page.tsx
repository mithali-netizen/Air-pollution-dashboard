"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  generateForecast,
  generateHistoricalData,
  getAQITrend,
  type ForecastData,
  type HistoricalData,
} from "@/lib/forecast"
import { getAQIStatus } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Minus, Cloud, Wind, Droplets, Thermometer, Calendar, Clock } from "lucide-react"

export default function ForecastPage() {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "48h" | "72h">("24h")

  useEffect(() => {
    loadForecastData()
  }, [])

  const loadForecastData = async () => {
    try {
      // Generate historical data
      const historical = generateHistoricalData()
      setHistoricalData(historical)

      // Generate forecast based on historical data
      const forecast = generateForecast(historical)
      setForecastData(forecast)
    } catch (error) {
      console.error("Failed to load forecast data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeframeData = () => {
    const hours = selectedTimeframe === "24h" ? 24 : selectedTimeframe === "48h" ? 48 : 72
    return forecastData.slice(0, hours)
  }

  const getTrendIcon = (trend: "improving" | "worsening" | "stable") => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-5 w-5 text-success" />
      case "worsening":
        return <TrendingUp className="h-5 w-5 text-destructive" />
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatChartData = (data: (HistoricalData | ForecastData)[]) => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date(item.timestamp).toLocaleDateString(),
      aqi: item.aqi,
      pm25: "pm25" in item ? item.pm25 : undefined,
      pm10: "pm10" in item ? item.pm10 : undefined,
      confidence: "confidence" in item ? item.confidence : 100,
    }))
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

  const trend = getAQITrend([...historicalData.slice(-12), ...forecastData.slice(0, 12)])
  const currentAQI = historicalData[historicalData.length - 1]?.aqi || 0
  const next24hAvg = Math.round(forecastData.slice(0, 24).reduce((sum, d) => sum + d.aqi, 0) / 24)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">AI-Powered Air Quality Forecast</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            24-72 hour predictions using machine learning and weather data analysis
          </p>
        </div>

        {/* Forecast Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current AQI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{currentAQI}</span>
                <Badge className={`${getAQIStatus(currentAQI).color.replace("text-", "bg-")} text-background`}>
                  {getAQIStatus(currentAQI).status.split(" ")[0]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">24h Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{next24hAvg}</span>
                <Badge className={`${getAQIStatus(next24hAvg).color.replace("text-", "bg-")} text-background`}>
                  {getAQIStatus(next24hAvg).status.split(" ")[0]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getTrendIcon(trend)}
                <span className="text-lg font-semibold capitalize">{trend}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{forecastData[0]?.confidence || 95}%</span>
                <Badge variant="outline">High</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Charts */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AQI Forecast
                </CardTitle>
                <CardDescription>Predicted air quality index for the next 72 hours</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedTimeframe === "24h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe("24h")}
                >
                  24h
                </Button>
                <Button
                  variant={selectedTimeframe === "48h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe("48h")}
                >
                  48h
                </Button>
                <Button
                  variant={selectedTimeframe === "72h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe("72h")}
                >
                  72h
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatChartData(getTimeframeData())}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="detailed" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detailed">Detailed Forecast</TabsTrigger>
            <TabsTrigger value="historical">Historical Trends</TabsTrigger>
            <TabsTrigger value="factors">Weather Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTimeframeData()
                .filter((_, index) => index % 6 === 0)
                .slice(0, 12)
                .map((forecast, index) => {
                  const { status, color } = getAQIStatus(forecast.aqi)
                  return (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">
                            {new Date(forecast.timestamp).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {forecast.confidence}% confidence
                          </Badge>
                        </div>
                        <CardDescription>
                          {new Date(forecast.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{forecast.aqi}</span>
                            <Badge className={`${color.replace("text-", "bg-")} text-background`}>
                              {status.split(" ")[0]}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Main Pollutant:</span>
                              <span className="font-medium">{forecast.mainPollutant}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Weather:</span>
                              <span className="font-medium">{forecast.weatherFactor}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  7-Day Historical Trend
                </CardTitle>
                <CardDescription>Past week's air quality patterns and pollutant levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData(historicalData.filter((_, index) => index % 4 === 0))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="pm25" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="pm10" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Weather Impact
                  </CardTitle>
                  <CardDescription>How weather conditions affect air quality predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wind className="h-5 w-5 text-primary" />
                        <span>Wind Speed</span>
                      </div>
                      <span className="font-semibold">12 km/h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span>Humidity</span>
                      </div>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        <span>Temperature</span>
                      </div>
                      <span className="font-semibold">28°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Prediction Accuracy
                  </CardTitle>
                  <CardDescription>Model performance over different time horizons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { period: "Next 6 hours", accuracy: 95 },
                      { period: "Next 24 hours", accuracy: 87 },
                      { period: "Next 48 hours", accuracy: 78 },
                      { period: "Next 72 hours", accuracy: 65 },
                    ].map((item) => (
                      <div key={item.period} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.period}</span>
                          <span className="font-semibold">{item.accuracy}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${item.accuracy}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
