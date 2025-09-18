export interface AQIData {
  location: string
  parameter: string
  value: number
  unit: string
  lastUpdated: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface ProcessedAQIData {
  aqi: number
  mainPollutant: string
  status: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous"
  color: string
  lastUpdated: string
  location: string
  pollutants: {
    pm25?: number
    pm10?: number
    no2?: number
    so2?: number
    co?: number
    o3?: number
  }
}

export function getAQIStatus(aqi: number): { status: ProcessedAQIData["status"]; color: string } {
  if (aqi <= 50) return { status: "Good", color: "text-success" }
  if (aqi <= 100) return { status: "Moderate", color: "text-warning" }
  if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "text-orange-500" }
  if (aqi <= 200) return { status: "Unhealthy", color: "text-destructive" }
  if (aqi <= 300) return { status: "Very Unhealthy", color: "text-purple-500" }
  return { status: "Hazardous", color: "text-red-700" }
}

export async function fetchDelhiAQI(): Promise<ProcessedAQIData> {
  try {
    const response = await fetch("/api/aqi")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching AQI data:", error)
    // Return fallback data
    return {
      aqi: 156,
      mainPollutant: "PM2.5",
      status: "Unhealthy",
      color: "text-destructive",
      lastUpdated: new Date().toISOString(),
      location: "Delhi",
      pollutants: { pm25: 89, pm10: 156 },
    }
  }
}

export async function fetchMonitoringStations(): Promise<
  Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    aqi: number
    status: string
    color: string
  }>
> {
  try {
    const response = await fetch("/api/stations")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching monitoring stations:", error)
    return []
  }
}

// AQI calculation functions
function calculatePM25AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 12, aqiLow: 0, aqiHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 },
  ]

  return calculateAQI(concentration, breakpoints)
}

function calculatePM10AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
    { cLow: 55, cHigh: 154, aqiLow: 51, aqiHigh: 100 },
    { cLow: 155, cHigh: 254, aqiLow: 101, aqiHigh: 150 },
    { cLow: 255, cHigh: 354, aqiLow: 151, aqiHigh: 200 },
    { cLow: 355, cHigh: 424, aqiLow: 201, aqiHigh: 300 },
    { cLow: 425, cHigh: 604, aqiLow: 301, aqiHigh: 500 },
  ]

  return calculateAQI(concentration, breakpoints)
}

function calculateNO2AQI(concentration: number): number {
  // Convert ppb to µg/m³ if needed
  const breakpoints = [
    { cLow: 0, cHigh: 53, aqiLow: 0, aqiHigh: 50 },
    { cLow: 54, cHigh: 100, aqiLow: 51, aqiHigh: 100 },
    { cLow: 101, cHigh: 360, aqiLow: 101, aqiHigh: 150 },
    { cLow: 361, cHigh: 649, aqiLow: 151, aqiHigh: 200 },
    { cLow: 650, cHigh: 1249, aqiLow: 201, aqiHigh: 300 },
    { cLow: 1250, cHigh: 2049, aqiLow: 301, aqiHigh: 500 },
  ]

  return calculateAQI(concentration, breakpoints)
}

function calculateSO2AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 35, aqiLow: 0, aqiHigh: 50 },
    { cLow: 36, cHigh: 75, aqiLow: 51, aqiHigh: 100 },
    { cLow: 76, cHigh: 185, aqiLow: 101, aqiHigh: 150 },
    { cLow: 186, cHigh: 304, aqiLow: 151, aqiHigh: 200 },
    { cLow: 305, cHigh: 604, aqiLow: 201, aqiHigh: 300 },
    { cLow: 605, cHigh: 1004, aqiLow: 301, aqiHigh: 500 },
  ]

  return calculateAQI(concentration, breakpoints)
}

function calculateCOAQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 4.4, aqiLow: 0, aqiHigh: 50 },
    { cLow: 4.5, cHigh: 9.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 9.5, cHigh: 12.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 12.5, cHigh: 15.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 15.5, cHigh: 30.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 30.5, cHigh: 50.4, aqiLow: 301, aqiHigh: 500 },
  ]

  return calculateAQI(concentration, breakpoints)
}

function calculateO3AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
    { cLow: 55, cHigh: 70, aqiLow: 51, aqiHigh: 100 },
    { cLow: 71, cHigh: 85, aqiLow: 101, aqiHigh: 150 },
    { cLow: 86, cHigh: 105, aqiLow: 151, aqiHigh: 200 },
    { cLow: 106, cHigh: 200, aqiLow: 201, aqiHigh: 300 },
  ]

  return calculateAQI(concentration, breakpoints)
}

function calculateAQI(concentration: number, breakpoints: any[]): number {
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      return ((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.aqiLow
    }
  }
  return 500 // Maximum AQI if concentration exceeds all breakpoints
}
