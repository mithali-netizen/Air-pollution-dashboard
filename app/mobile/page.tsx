"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getMobileFeatureManager } from "@/lib/mobile-features"
import { getIoTSensorManager } from "@/lib/iot-sensors"
import {
  MapPin,
  Navigation,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Clock,
  Route,
  Share,
  Bell,
  Download,
  Smartphone,
  LocateIcon,
  RefreshCw
} from "lucide-react"

export default function MobilePage() {
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [hyperlocalAQI, setHyperlocalAQI] = useState<any>(null)
  const [cleanRoutes, setCleanRoutes] = useState<any[]>([])
  const [nearbyCleanSpots, setNearbyCleanSpots] = useState<any[]>([])
  const [offlineData, setOfflineData] = useState<any>(null)
  const [networkStatus, setNetworkStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState(false)

  useEffect(() => {
    initializeMobileFeatures()
  }, [])

  
    const initializeMobileFeatures = async () => {
      try {
        const mobileManager = getMobileFeatureManager()
        const iotManager = getIoTSensorManager()
  
        // Request location permission
        const hasPermission = await mobileManager.requestLocationPermission()
        setLocationPermission(hasPermission)
  
        if (hasPermission) {
          const location = await mobileManager.getCurrentLocation()
          setCurrentLocation(location)
  
          if (location) {
            // Fetch real-time AQI from OpenWeatherMap API
            const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`
            )
            if (response.ok) {
              const data = await response.json()
              const aqiMapping = [0, 50, 100, 150, 200, 300]
              const airQuality = data.list[0]
              const aqi = airQuality.main.aqi
              const usAqi = aqiMapping[aqi] || 150
              setHyperlocalAQI({
                aqi: usAqi,
                primaryPollutant: "PM2.5",
                confidence: 100,
                sensorCount: 1,
                lastUpdated: new Date().toISOString(),
                recommendations: [
                  usAqi <= 100
                    ? "Air quality is moderate. You can go outside."
                    : usAqi <= 150
                    ? "Unhealthy for sensitive groups. Limit outdoor activities."
                    : "Unhealthy air quality. Avoid outdoor activities.",
                ],
              })
            } else {
              console.error("Failed to fetch AQI data")
            }
  
            // Find clean routes (mock destination)
            const destination = {
              latitude: location.latitude + 0.01,
              longitude: location.longitude + 0.01,
              accuracy: 10,
              timestamp: new Date().toISOString()
            }
            const routes = await mobileManager.findCleanRoutes(location, destination)
            setCleanRoutes(routes)
  
            // Find nearby clean spots
            const cleanSpots = await mobileManager.getNearbyCleanSpots(location, 2)
            setNearbyCleanSpots(cleanSpots)
          }
        }
  
        // Get offline data
        const offline = await mobileManager.getOfflineData()
        setOfflineData(offline)
  
        // Get network status
        const network = await mobileManager.getNetworkStatus()
        setNetworkStatus(network)
  
      } catch (error) {
        console.error("Failed to initialize mobile features:", error)
      } finally {
        setLoading(false)
      }
    }


  const handleLocationTracking = async () => {
    const mobileManager = getMobileFeatureManager()
    const success = mobileManager.startLocationTracking(async (location) => {
      setCurrentLocation(location)
      console.log("Location updated:", location)
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`
        )
        if (response.ok) {
          const data = await response.json()
          // OpenWeather AQI is 1-5, map to US AQI
          const aqiMapping = [0, 50, 100, 150, 200, 300]
          const airQuality = data.list[0]
          const aqi = airQuality.main.aqi
          const usAqi = aqiMapping[aqi] || 150
          setHyperlocalAQI({
            aqi: usAqi,
            primaryPollutant: "PM2.5",
            confidence: 100,
            sensorCount: 1,
            lastUpdated: new Date().toISOString(),
            recommendations: [
              usAqi <= 100
                ? "Air quality is moderate. You can go outside."
                : usAqi <= 150
                ? "Unhealthy for sensitive groups. Limit outdoor activities."
                : "Unhealthy air quality. Avoid outdoor activities.",
            ],
          })
        } else {
          console.error("Failed to fetch AQI data")
        }
      } catch (error) {
        console.error("Error fetching AQI data:", error)
      }
    })
  
    if (success) {
      console.log("Location tracking started")
    }
  }

  const handleOfflineMode = async () => {
    const mobileManager = getMobileFeatureManager()
    const success = await mobileManager.enableOfflineMode()
    
    if (success) {
      console.log("Offline mode enabled")
      // Refresh offline data
      const offline = await mobileManager.getOfflineData()
      setOfflineData(offline)
    }
  }

  const handleShareLocation = async () => {
    if (!currentLocation) return

    const mobileManager = getMobileFeatureManager()
    const message = `Current air quality at my location: AQI ${hyperlocalAQI?.aqi || 'Unknown'}`
    await mobileManager.shareLocation(currentLocation, message)
  }

  const handleNotificationPermission = async () => {
    const mobileManager = getMobileFeatureManager()
    const granted = await mobileManager.requestNotificationPermission()
    console.log("Notification permission:", granted)
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
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Mobile Features</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Enhanced mobile experience with location services, offline support, and hyperlocal monitoring
          </p>
        </div>

        {/* Location Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LocateIcon className="h-5 w-5" />
                Location Services
              </CardTitle>
              <CardDescription>GPS-based air quality monitoring and navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentLocation ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Location</span>
                    <Badge variant="outline" className="bg-success text-success-foreground">
                      <LocateIcon className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Lat: {currentLocation.latitude.toFixed(6)}</p>
                    <p>Lon: {currentLocation.longitude.toFixed(6)}</p>
                    <p>Accuracy: {currentLocation.accuracy.toFixed(0)}m</p>
                  </div>
                  <Button onClick={handleLocationTracking} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Start Tracking
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <LocateIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {locationPermission ? "Location permission granted" : "Location permission required"}
                  </p>
                  <Button onClick={initializeMobileFeatures}>
                    <LocateIcon className="h-4 w-4 mr-2" />
                    Enable Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Features
              </CardTitle>
              <CardDescription>Enhanced mobile capabilities and offline support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offline Mode</span>
                <Button variant="outline" size="sm" onClick={handleOfflineMode}>
                  <Download className="h-4 w-4 mr-2" />
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <Button variant="outline" size="sm" onClick={handleNotificationPermission}>
                  <Bell className="h-4 w-4 mr-2" />
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Share Location</span>
                <Button variant="outline" size="sm" onClick={handleShareLocation} disabled={!currentLocation}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hyperlocal AQI */}
        {hyperlocalAQI && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Hyperlocal Air Quality
              </CardTitle>
              <CardDescription>Real-time AQI data from nearby IoT sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{hyperlocalAQI.aqi}</div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {hyperlocalAQI.primaryPollutant}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Primary Pollutant
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{hyperlocalAQI.confidence}%</div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <Progress value={hyperlocalAQI.confidence} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{hyperlocalAQI.sensorCount}</div>
                  <p className="text-sm text-muted-foreground">Nearby Sensors</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(hyperlocalAQI.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {hyperlocalAQI.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clean Routes */}
        {cleanRoutes.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Clean Route Suggestions
              </CardTitle>
              <CardDescription>AI-powered route recommendations for cleaner air exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cleanRoutes.map((route, index) => (
                  <div key={route.routeId} className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{route.routeId.replace('-', ' ').toUpperCase()}</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          route.pollutionLevel === 'low' ? 'bg-success text-success-foreground' :
                          route.pollutionLevel === 'moderate' ? 'bg-warning text-warning-foreground' :
                          'bg-destructive text-destructive-foreground'
                        }
                      >
                        {route.pollutionLevel}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{route.totalDistance.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{route.estimatedTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg AQI:</span>
                        <span className="font-medium">{route.averageAQI}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-2">Recommendations:</h5>
                      <div className="space-y-1">
                        {route.recommendations.slice(0, 2).map((rec: string, i: number) => (
                          <p key={i} className="text-xs text-muted-foreground">• {rec}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Clean Spots */}
        {nearbyCleanSpots.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Clean Spots
              </CardTitle>
              <CardDescription>Parks and green areas with better air quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyCleanSpots.map((spot, index) => (
                  <div key={index} className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-success" />
                      <div>
                        <h4 className="font-semibold">{spot.address}</h4>
                        <p className="text-sm text-muted-foreground">
                          {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Network Status */}
        {networkStatus && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {networkStatus.online ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                Network Status
              </CardTitle>
              <CardDescription>Connection and offline data status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {networkStatus.online ? "Online" : "Offline"}
                  </div>
                  <p className="text-sm text-muted-foreground">Connection Status</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{networkStatus.connectionType}</div>
                  <p className="text-sm text-muted-foreground">Connection Type</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{networkStatus.effectiveType}</div>
                  <p className="text-sm text-muted-foreground">Effective Type</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offline Data */}
        {offlineData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Offline Data
              </CardTitle>
              <CardDescription>Cached data for offline access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Cache Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Last Sync:</span>
                      <span className="text-sm font-medium">
                        {new Date(offlineData.lastSync).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cache Size:</span>
                      <span className="text-sm font-medium">
                        {(offlineData.cacheSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Size:</span>
                      <span className="text-sm font-medium">
                        {(offlineData.maxCacheSize / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Cached Data</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">AQI Data: {offlineData.cachedAQIData.length} entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Forecast Data: {offlineData.cachedForecastData.length} entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Sensor Data: {offlineData.cachedSensorData.length} entries</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
