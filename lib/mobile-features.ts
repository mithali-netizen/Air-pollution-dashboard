export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
  address?: string
}

export interface RouteData {
  routeId: string
  startLocation: LocationData
  endLocation: LocationData
  waypoints: LocationData[]
  totalDistance: number
  estimatedTime: number
  averageAQI: number
  maxAQI: number
  minAQI: number
  pollutionLevel: "low" | "moderate" | "high" | "very-high"
  recommendations: string[]
  alternativeRoutes: AlternativeRoute[]
}

export interface AlternativeRoute {
  routeId: string
  name: string
  distance: number
  estimatedTime: number
  averageAQI: number
  pollutionLevel: "low" | "moderate" | "high" | "very-high"
  description: string
  advantages: string[]
  disadvantages: string[]
}

export interface OfflineData {
  lastSync: string
  cachedAQIData: any[]
  cachedForecastData: any[]
  cachedSensorData: any[]
  cacheSize: number
  maxCacheSize: number
}

export class MobileFeatureManager {
  private static instance: MobileFeatureManager
  private currentLocation: LocationData | null = null
  private offlineData: OfflineData | null = null
  private watchId: number | null = null

  static getInstance(): MobileFeatureManager {
    if (!MobileFeatureManager.instance) {
      MobileFeatureManager.instance = new MobileFeatureManager()
    }
    return MobileFeatureManager.instance
  }

  async requestLocationPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser")
      return false
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          }
          resolve(true)
        },
        (error) => {
          console.error("Error getting location:", error)
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    if (this.currentLocation) {
      return this.currentLocation
    }

    const hasPermission = await this.requestLocationPermission()
    return hasPermission ? this.currentLocation : null
  }

  startLocationTracking(callback: (location: LocationData) => void): boolean {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported")
      return false
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        }
        this.currentLocation = location
        callback(location)
      },
      (error) => {
        console.error("Error tracking location:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    )

    return true
  }

  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  async findCleanRoutes(start: LocationData, end: LocationData): Promise<RouteData[]> {
    // Mock route calculation with AQI data
    const routes: RouteData[] = []

    // Route 1: Direct route (usually more polluted)
    const directRoute: RouteData = {
      routeId: "direct-route",
      startLocation: start,
      endLocation: end,
      waypoints: [],
      totalDistance: this.calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude),
      estimatedTime: 25,
      averageAQI: 165,
      maxAQI: 185,
      minAQI: 145,
      pollutionLevel: "high",
      recommendations: [
        "High pollution route - avoid if possible",
        "Wear N95 mask if taking this route",
        "Consider alternative routes"
      ],
      alternativeRoutes: []
    }

    // Route 2: Green corridor route
    const greenRoute: RouteData = {
      routeId: "green-route",
      startLocation: start,
      endLocation: end,
      waypoints: [
        {
          latitude: start.latitude + 0.01,
          longitude: start.longitude + 0.01,
          accuracy: 10,
          timestamp: new Date().toISOString()
        }
      ],
      totalDistance: this.calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude) * 1.2,
      estimatedTime: 35,
      averageAQI: 95,
      maxAQI: 110,
      minAQI: 80,
      pollutionLevel: "low",
      recommendations: [
        "Clean air route with tree cover",
        "Suitable for walking and cycling",
        "Recommended for sensitive individuals"
      ],
      alternativeRoutes: []
    }

    // Route 3: Metro + walking route
    const metroRoute: RouteData = {
      routeId: "metro-route",
      startLocation: start,
      endLocation: end,
      waypoints: [
        {
          latitude: start.latitude + 0.005,
          longitude: start.longitude + 0.005,
          accuracy: 10,
          timestamp: new Date().toISOString()
        }
      ],
      totalDistance: this.calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude) * 0.8,
      estimatedTime: 20,
      averageAQI: 120,
      maxAQI: 140,
      minAQI: 100,
      pollutionLevel: "moderate",
      recommendations: [
        "Metro reduces exposure time",
        "Short walking distance",
        "Good for daily commute"
      ],
      alternativeRoutes: []
    }

    // Add alternative routes to each route
    directRoute.alternativeRoutes = [greenRoute, metroRoute]
    greenRoute.alternativeRoutes = [directRoute, metroRoute]
    metroRoute.alternativeRoutes = [directRoute, greenRoute]

    routes.push(directRoute, greenRoute, metroRoute)

    return routes.sort((a, b) => a.averageAQI - b.averageAQI)
  }

  async getNearbyCleanSpots(location: LocationData, radiusKm: number = 2): Promise<LocationData[]> {
    // Mock clean spots (parks, green areas, etc.)
    const cleanSpots: LocationData[] = [
      {
        latitude: location.latitude + 0.01,
        longitude: location.longitude + 0.01,
        accuracy: 10,
        timestamp: new Date().toISOString(),
        address: "Lodhi Garden"
      },
      {
        latitude: location.latitude - 0.008,
        longitude: location.longitude + 0.012,
        accuracy: 10,
        timestamp: new Date().toISOString(),
        address: "India Gate Lawns"
      },
      {
        latitude: location.latitude + 0.015,
        longitude: location.longitude - 0.005,
        accuracy: 10,
        timestamp: new Date().toISOString(),
        address: "Central Park"
      }
    ]

    return cleanSpots.filter(spot => {
      const distance = this.calculateDistance(
        location.latitude, location.longitude,
        spot.latitude, spot.longitude
      )
      return distance <= radiusKm
    })
  }

  async enableOfflineMode(): Promise<boolean> {
    try {
      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        console.error("Service Worker not supported")
        return false
      }

      // Register service worker for offline functionality
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log("Service Worker registered:", registration)

      // Cache essential data for offline use
      await this.cacheEssentialData()

      return true
    } catch (error) {
      console.error("Failed to enable offline mode:", error)
      return false
    }
  }

  private async cacheEssentialData(): Promise<void> {
    try {
      // Cache AQI data
      const aqiResponse = await fetch('/api/aqi')
      const aqiData = await aqiResponse.json()
      
      // Cache forecast data
      const forecastResponse = await fetch('/api/forecast')
      const forecastData = await forecastResponse.json()

      // Store in localStorage for offline access
      localStorage.setItem('cachedAQIData', JSON.stringify(aqiData))
      localStorage.setItem('cachedForecastData', JSON.stringify(forecastData))
      localStorage.setItem('lastSync', new Date().toISOString())

      this.offlineData = {
        lastSync: new Date().toISOString(),
        cachedAQIData: [aqiData],
        cachedForecastData: [forecastData],
        cachedSensorData: [],
        cacheSize: JSON.stringify(aqiData).length + JSON.stringify(forecastData).length,
        maxCacheSize: 10 * 1024 * 1024 // 10MB
      }

      console.log("Essential data cached for offline use")
    } catch (error) {
      console.error("Failed to cache essential data:", error)
    }
  }

  async getOfflineData(): Promise<OfflineData | null> {
    if (this.offlineData) {
      return this.offlineData
    }

    try {
      const lastSync = localStorage.getItem('lastSync')
      const cachedAQIData = localStorage.getItem('cachedAQIData')
      const cachedForecastData = localStorage.getItem('cachedForecastData')

      if (lastSync && cachedAQIData && cachedForecastData) {
        this.offlineData = {
          lastSync,
          cachedAQIData: JSON.parse(cachedAQIData),
          cachedForecastData: JSON.parse(cachedForecastData),
          cachedSensorData: [],
          cacheSize: cachedAQIData.length + cachedForecastData.length,
          maxCacheSize: 10 * 1024 * 1024
        }
      }
    } catch (error) {
      console.error("Failed to get offline data:", error)
    }

    return this.offlineData
  }

  async isOnline(): Promise<boolean> {
    return navigator.onLine
  }

  async getNetworkStatus(): Promise<{
    online: boolean
    connectionType: string
    effectiveType: string
  }> {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    return {
      online: navigator.onLine,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown'
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  async shareLocation(location: LocationData, message: string): Promise<boolean> {
    if (!navigator.share) {
      console.error("Web Share API not supported")
      return false
    }

    try {
      await navigator.share({
        title: "Air Quality Alert",
        text: message,
        url: `https://maps.google.com/?q=${location.latitude},${location.longitude}`
      })
      return true
    } catch (error) {
      console.error("Failed to share location:", error)
      return false
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.error("Notifications not supported")
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }
}

export const getMobileFeatureManager = () => MobileFeatureManager.getInstance()
