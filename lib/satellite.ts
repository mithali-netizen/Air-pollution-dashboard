export interface SatelliteData {
  timestamp: string
  latitude: number
  longitude: number
  fireDetected: boolean
  confidence: number
  source: "MODIS" | "ISRO" | "VIIRS"
  intensity: "low" | "moderate" | "high" | "very-high"
  area: number // in hectares
  type: "stubble_burning" | "forest_fire" | "industrial" | "unknown"
}

export interface StubbleBurningEvent {
  id: string
  location: string
  state: "Punjab" | "Haryana" | "Uttar Pradesh"
  district: string
  startDate: string
  endDate?: string
  area: number
  intensity: number
  impactOnDelhi: number // percentage contribution to Delhi AQI
  status: "active" | "extinguished" | "monitored"
}

export class SatelliteDataManager {
  private static instance: SatelliteDataManager
  private cache: Map<string, SatelliteData[]> = new Map()
  private lastUpdate: Date = new Date()

  static getInstance(): SatelliteDataManager {
    if (!SatelliteDataManager.instance) {
      SatelliteDataManager.instance = new SatelliteDataManager()
    }
    return SatelliteDataManager.instance
  }

  async fetchMODISData(): Promise<SatelliteData[]> {
    try {
      // Mock NASA MODIS data for stubble burning detection
      const mockData: SatelliteData[] = [
        {
          timestamp: new Date().toISOString(),
          latitude: 30.7333,
          longitude: 76.7794,
          fireDetected: true,
          confidence: 0.89,
          source: "MODIS",
          intensity: "high",
          area: 45.2,
          type: "stubble_burning"
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          latitude: 29.0588,
          longitude: 76.0856,
          fireDetected: true,
          confidence: 0.76,
          source: "MODIS",
          intensity: "moderate",
          area: 23.8,
          type: "stubble_burning"
        }
      ]
      
      this.cache.set("modis", mockData)
      return mockData
    } catch (error) {
      console.error("Failed to fetch MODIS data:", error)
      return []
    }
  }

  async fetchISROData(): Promise<SatelliteData[]> {
    try {
      // Mock ISRO satellite data
      const mockData: SatelliteData[] = [
        {
          timestamp: new Date().toISOString(),
          latitude: 28.6139,
          longitude: 77.209,
          fireDetected: false,
          confidence: 0.95,
          source: "ISRO",
          intensity: "low",
          area: 0,
          type: "unknown"
        }
      ]
      
      this.cache.set("isro", mockData)
      return mockData
    } catch (error) {
      console.error("Failed to fetch ISRO data:", error)
      return []
    }
  }

  async fetchVIIRSData(): Promise<SatelliteData[]> {
    try {
      // Mock VIIRS (Visible Infrared Imaging Radiometer Suite) data
      const mockData: SatelliteData[] = [
        {
          timestamp: new Date().toISOString(),
          latitude: 30.7333,
          longitude: 76.7794,
          fireDetected: true,
          confidence: 0.92,
          source: "VIIRS",
          intensity: "very-high",
          area: 67.3,
          type: "stubble_burning"
        }
      ]
      
      this.cache.set("viirs", mockData)
      return mockData
    } catch (error) {
      console.error("Failed to fetch VIIRS data:", error)
      return []
    }
  }

  async getAllSatelliteData(): Promise<SatelliteData[]> {
    const [modisData, isroData, viirsData] = await Promise.all([
      this.fetchMODISData(),
      this.fetchISROData(),
      this.fetchVIIRSData()
    ])

    return [...modisData, ...isroData, ...viirsData]
  }

  async getStubbleBurningEvents(): Promise<StubbleBurningEvent[]> {
    const satelliteData = await this.getAllSatelliteData()
    const stubbleEvents: StubbleBurningEvent[] = []

    satelliteData.forEach((data, index) => {
      if (data.fireDetected && data.type === "stubble_burning") {
        const event: StubbleBurningEvent = {
          id: `stubble-${index}`,
          location: this.getLocationName(data.latitude, data.longitude),
          state: this.getStateFromCoordinates(data.latitude, data.longitude),
          district: this.getDistrictFromCoordinates(data.latitude, data.longitude),
          startDate: data.timestamp,
          area: data.area,
          intensity: this.getIntensityScore(data.intensity),
          impactOnDelhi: this.calculateDelhiImpact(data),
          status: "active"
        }
        stubbleEvents.push(event)
      }
    })

    return stubbleEvents
  }

  private getLocationName(lat: number, lon: number): string {
    // Mock location names based on coordinates
    if (lat > 30.5 && lat < 31.0 && lon > 76.0 && lon < 77.0) {
      return "Karnal, Haryana"
    }
    if (lat > 30.0 && lat < 30.5 && lon > 75.5 && lon < 76.5) {
      return "Ludhiana, Punjab"
    }
    return "Unknown Location"
  }

  private getStateFromCoordinates(lat: number, lon: number): "Punjab" | "Haryana" | "Uttar Pradesh" {
    if (lat > 30.5) return "Haryana"
    if (lat > 29.5) return "Punjab"
    return "Uttar Pradesh"
  }

  private getDistrictFromCoordinates(lat: number, lon: number): string {
    if (lat > 30.5 && lat < 31.0 && lon > 76.0 && lon < 77.0) {
      return "Karnal"
    }
    if (lat > 30.0 && lat < 30.5 && lon > 75.5 && lon < 76.5) {
      return "Ludhiana"
    }
    return "Unknown District"
  }

  private getIntensityScore(intensity: string): number {
    switch (intensity) {
      case "low": return 1
      case "moderate": return 2
      case "high": return 3
      case "very-high": return 4
      default: return 1
    }
  }

  private calculateDelhiImpact(data: SatelliteData): number {
    // Calculate impact on Delhi AQI based on distance and intensity
    const delhiLat = 28.6139
    const delhiLon = 77.209
    const distance = this.calculateDistance(
      data.latitude, data.longitude,
      delhiLat, delhiLon
    )

    let impact = 0
    if (distance < 100) impact = 25 // Within 100km
    else if (distance < 200) impact = 15 // Within 200km
    else if (distance < 300) impact = 8 // Within 300km
    else impact = 3 // Beyond 300km

    // Adjust based on intensity
    const intensityMultiplier = this.getIntensityScore(data.intensity) / 4
    return Math.round(impact * intensityMultiplier)
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

  getCacheStatus(): { lastUpdate: Date; dataCount: number } {
    const totalData = Array.from(this.cache.values()).flat().length
    return {
      lastUpdate: this.lastUpdate,
      dataCount: totalData
    }
  }
}

export const getSatelliteManager = () => SatelliteDataManager.getInstance()
