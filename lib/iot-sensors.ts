export interface IoTSensorData {
  sensorId: string
  location: string
  latitude: number
  longitude: number
  timestamp: string
  pm25: number
  pm10: number
  no2: number
  so2: number
  co: number
  o3: number
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  batteryLevel: number
  signalStrength: number
  status: "online" | "offline" | "maintenance"
  lastCalibration: string
  nextCalibration: string
}

export interface SensorNetwork {
  totalSensors: number
  onlineSensors: number
  offlineSensors: number
  maintenanceSensors: number
  averageBatteryLevel: number
  averageSignalStrength: number
  lastUpdate: string
}

export interface HyperlocalAQI {
  location: string
  aqi: number
  primaryPollutant: string
  confidence: number
  sensorCount: number
  lastUpdated: string
  recommendations: string[]
}

export class IoTSensorManager {
  private static instance: IoTSensorManager
  private sensors: Map<string, IoTSensorData> = new Map()
  private networkStatus: SensorNetwork | null = null

  static getInstance(): IoTSensorManager {
    if (!IoTSensorManager.instance) {
      IoTSensorManager.instance = new IoTSensorManager()
    }
    return IoTSensorManager.instance
  }

  async fetchSensorData(): Promise<IoTSensorData[]> {
    try {
      // Mock IoT sensor data for Delhi-NCR
      const mockSensors: IoTSensorData[] = [
        {
          sensorId: "iot-delhi-001",
          location: "Connaught Place",
          latitude: 28.6315,
          longitude: 77.2167,
          timestamp: new Date().toISOString(),
          pm25: 85.2,
          pm10: 142.8,
          no2: 45.6,
          so2: 12.3,
          co: 2.1,
          o3: 38.9,
          temperature: 28.5,
          humidity: 65,
          windSpeed: 3.2,
          windDirection: 180,
          pressure: 1013.2,
          batteryLevel: 87,
          signalStrength: 85,
          status: "online",
          lastCalibration: "2024-01-15T10:00:00Z",
          nextCalibration: "2024-02-15T10:00:00Z"
        },
        {
          sensorId: "iot-delhi-002",
          location: "Karol Bagh",
          latitude: 28.6517,
          longitude: 77.1908,
          timestamp: new Date().toISOString(),
          pm25: 92.4,
          pm10: 156.7,
          no2: 52.1,
          so2: 15.8,
          co: 2.8,
          o3: 42.3,
          temperature: 29.1,
          humidity: 68,
          windSpeed: 2.8,
          windDirection: 165,
          pressure: 1012.8,
          batteryLevel: 92,
          signalStrength: 78,
          status: "online",
          lastCalibration: "2024-01-10T14:30:00Z",
          nextCalibration: "2024-02-10T14:30:00Z"
        },
        {
          sensorId: "iot-delhi-003",
          location: "Lajpat Nagar",
          latitude: 28.5671,
          longitude: 77.2431,
          timestamp: new Date().toISOString(),
          pm25: 78.9,
          pm10: 134.2,
          no2: 38.7,
          so2: 9.6,
          co: 1.9,
          o3: 35.4,
          temperature: 27.8,
          humidity: 62,
          windSpeed: 3.5,
          windDirection: 195,
          pressure: 1013.5,
          batteryLevel: 95,
          signalStrength: 92,
          status: "online",
          lastCalibration: "2024-01-20T09:15:00Z",
          nextCalibration: "2024-02-20T09:15:00Z"
        },
        {
          sensorId: "iot-gurgaon-001",
          location: "Cyber City",
          latitude: 28.4595,
          longitude: 77.0266,
          timestamp: new Date().toISOString(),
          pm25: 88.7,
          pm10: 148.9,
          no2: 48.3,
          so2: 13.2,
          co: 2.4,
          o3: 40.1,
          temperature: 29.3,
          humidity: 70,
          windSpeed: 2.9,
          windDirection: 170,
          pressure: 1012.1,
          batteryLevel: 78,
          signalStrength: 88,
          status: "online",
          lastCalibration: "2024-01-12T11:45:00Z",
          nextCalibration: "2024-02-12T11:45:00Z"
        },
        {
          sensorId: "iot-noida-001",
          location: "Sector 18",
          latitude: 28.5355,
          longitude: 77.3910,
          timestamp: new Date().toISOString(),
          pm25: 91.3,
          pm10: 152.4,
          no2: 50.7,
          so2: 14.6,
          co: 2.6,
          o3: 41.8,
          temperature: 28.9,
          humidity: 66,
          windSpeed: 3.1,
          windDirection: 185,
          pressure: 1012.9,
          batteryLevel: 83,
          signalStrength: 81,
          status: "online",
          lastCalibration: "2024-01-18T16:20:00Z",
          nextCalibration: "2024-02-18T16:20:00Z"
        },
        {
          sensorId: "iot-delhi-004",
          location: "Rohini",
          latitude: 28.7041,
          longitude: 77.1025,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          pm25: 95.8,
          pm10: 161.2,
          no2: 55.4,
          so2: 16.9,
          co: 3.1,
          o3: 44.7,
          temperature: 30.2,
          humidity: 72,
          windSpeed: 2.6,
          windDirection: 160,
          pressure: 1011.8,
          batteryLevel: 45,
          signalStrength: 65,
          status: "offline",
          lastCalibration: "2024-01-05T08:30:00Z",
          nextCalibration: "2024-02-05T08:30:00Z"
        }
      ]

      // Update sensor cache
      mockSensors.forEach(sensor => {
        this.sensors.set(sensor.sensorId, sensor)
      })

      // Update network status
      this.updateNetworkStatus(mockSensors)

      return mockSensors
    } catch (error) {
      console.error("Failed to fetch IoT sensor data:", error)
      return []
    }
  }

  private updateNetworkStatus(sensors: IoTSensorData[]): void {
    const onlineSensors = sensors.filter(s => s.status === "online").length
    const offlineSensors = sensors.filter(s => s.status === "offline").length
    const maintenanceSensors = sensors.filter(s => s.status === "maintenance").length
    const averageBatteryLevel = sensors.reduce((sum, s) => sum + s.batteryLevel, 0) / sensors.length
    const averageSignalStrength = sensors.reduce((sum, s) => sum + s.signalStrength, 0) / sensors.length

    this.networkStatus = {
      totalSensors: sensors.length,
      onlineSensors,
      offlineSensors,
      maintenanceSensors,
      averageBatteryLevel: Math.round(averageBatteryLevel),
      averageSignalStrength: Math.round(averageSignalStrength),
      lastUpdate: new Date().toISOString()
    }
  }

  async getNetworkStatus(): Promise<SensorNetwork | null> {
    if (!this.networkStatus) {
      await this.fetchSensorData()
    }
    return this.networkStatus
  }

  async getHyperlocalAQI(latitude: number, longitude: number, radiusKm: number = 5): Promise<HyperlocalAQI> {
    const sensors = Array.from(this.sensors.values())
    const nearbySensors = sensors.filter(sensor => {
      const distance = this.calculateDistance(
        latitude, longitude,
        sensor.latitude, sensor.longitude
      )
      return distance <= radiusKm && sensor.status === "online"
    })

    if (nearbySensors.length === 0) {
      return {
        location: "No sensors nearby",
        aqi: 0,
        primaryPollutant: "Unknown",
        confidence: 0,
        sensorCount: 0,
        lastUpdated: new Date().toISOString(),
        recommendations: ["No sensor data available for this location"]
      }
    }

    // Calculate average AQI from nearby sensors
    const avgPM25 = nearbySensors.reduce((sum, s) => sum + s.pm25, 0) / nearbySensors.length
    const avgPM10 = nearbySensors.reduce((sum, s) => sum + s.pm10, 0) / nearbySensors.length
    const avgNO2 = nearbySensors.reduce((sum, s) => sum + s.no2, 0) / nearbySensors.length

    // Calculate AQI based on highest pollutant
    const aqi = Math.max(
      this.calculatePM25AQI(avgPM25),
      this.calculatePM10AQI(avgPM10),
      this.calculateNO2AQI(avgNO2)
    )

    const primaryPollutant = this.getPrimaryPollutant(avgPM25, avgPM10, avgNO2)
    const confidence = Math.min(95, 60 + (nearbySensors.length * 10))

    return {
      location: this.getLocationName(latitude, longitude),
      aqi: Math.round(aqi),
      primaryPollutant,
      confidence,
      sensorCount: nearbySensors.length,
      lastUpdated: new Date().toISOString(),
      recommendations: this.generateRecommendations(aqi, primaryPollutant)
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

  private calculatePM25AQI(concentration: number): number {
    const breakpoints = [
      { cLow: 0, cHigh: 12, aqiLow: 0, aqiHigh: 50 },
      { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
      { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
      { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
      { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
      { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 }
    ]
    return this.calculateAQI(concentration, breakpoints)
  }

  private calculatePM10AQI(concentration: number): number {
    const breakpoints = [
      { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
      { cLow: 55, cHigh: 154, aqiLow: 51, aqiHigh: 100 },
      { cLow: 155, cHigh: 254, aqiLow: 101, aqiHigh: 150 },
      { cLow: 255, cHigh: 354, aqiLow: 151, aqiHigh: 200 },
      { cLow: 355, cHigh: 424, aqiLow: 201, aqiHigh: 300 },
      { cLow: 425, cHigh: 604, aqiLow: 301, aqiHigh: 500 }
    ]
    return this.calculateAQI(concentration, breakpoints)
  }

  private calculateNO2AQI(concentration: number): number {
    const breakpoints = [
      { cLow: 0, cHigh: 53, aqiLow: 0, aqiHigh: 50 },
      { cLow: 54, cHigh: 100, aqiLow: 51, aqiHigh: 100 },
      { cLow: 101, cHigh: 360, aqiLow: 101, aqiHigh: 150 },
      { cLow: 361, cHigh: 649, aqiLow: 151, aqiHigh: 200 },
      { cLow: 650, cHigh: 1249, aqiLow: 201, aqiHigh: 300 },
      { cLow: 1250, cHigh: 2049, aqiLow: 301, aqiHigh: 500 }
    ]
    return this.calculateAQI(concentration, breakpoints)
  }

  private calculateAQI(concentration: number, breakpoints: any[]): number {
    for (const bp of breakpoints) {
      if (concentration >= bp.cLow && concentration <= bp.cHigh) {
        return ((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.aqiLow
      }
    }
    return 500
  }

  private getPrimaryPollutant(pm25: number, pm10: number, no2: number): string {
    const pm25AQI = this.calculatePM25AQI(pm25)
    const pm10AQI = this.calculatePM10AQI(pm10)
    const no2AQI = this.calculateNO2AQI(no2)

    if (pm25AQI >= pm10AQI && pm25AQI >= no2AQI) return "PM2.5"
    if (pm10AQI >= no2AQI) return "PM10"
    return "NO2"
  }

  private getLocationName(lat: number, lon: number): string {
    // Mock location names based on coordinates
    if (lat > 28.6 && lat < 28.7 && lon > 77.2 && lon < 77.3) {
      return "Central Delhi"
    }
    if (lat > 28.4 && lat < 28.5 && lon > 77.0 && lon < 77.1) {
      return "Gurgaon"
    }
    if (lat > 28.5 && lat < 28.6 && lon > 77.3 && lon < 77.4) {
      return "Noida"
    }
    return "Delhi-NCR"
  }

  private generateRecommendations(aqi: number, pollutant: string): string[] {
    const recommendations: string[] = []
    
    if (aqi <= 50) {
      recommendations.push("Excellent air quality - perfect for outdoor activities")
    } else if (aqi <= 100) {
      recommendations.push("Good air quality - suitable for most outdoor activities")
    } else if (aqi <= 150) {
      recommendations.push("Moderate air quality - sensitive individuals should limit outdoor activities")
      recommendations.push("Consider wearing a mask if you have respiratory conditions")
    } else if (aqi <= 200) {
      recommendations.push("Unhealthy air quality - limit outdoor activities")
      recommendations.push("Wear N95 masks when going outside")
      recommendations.push("Keep windows closed and use air purifiers")
    } else {
      recommendations.push("Very unhealthy air quality - avoid outdoor activities")
      recommendations.push("Stay indoors with air purifiers running")
      recommendations.push("Wear N95 masks if you must go outside")
    }

    if (pollutant === "PM2.5") {
      recommendations.push("PM2.5 is the primary concern - these particles can penetrate deep into lungs")
    } else if (pollutant === "PM10") {
      recommendations.push("PM10 particles are larger but can still cause respiratory issues")
    } else if (pollutant === "NO2") {
      recommendations.push("High NO2 levels - avoid areas with heavy traffic")
    }

    return recommendations
  }

  async getSensorById(sensorId: string): Promise<IoTSensorData | null> {
    return this.sensors.get(sensorId) || null
  }

  async getAllSensors(): Promise<IoTSensorData[]> {
    return Array.from(this.sensors.values())
  }
}

export const getIoTSensorManager = () => IoTSensorManager.getInstance()
