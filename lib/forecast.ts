export interface ForecastData {
  timestamp: string
  aqi: number
  mainPollutant: string
  confidence: number
  weatherFactor: string
}

export interface HistoricalData {
  timestamp: string
  aqi: number
  pm25: number
  pm10: number
  temperature: number
  humidity: number
  windSpeed: number
}

export function generateForecast(historicalData: HistoricalData[]): ForecastData[] {
  const forecast: ForecastData[] = []
  const now = new Date()

  // Simple moving average with weather factors
  for (let i = 0; i < 72; i++) {
    // 72 hours forecast
    const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000)

    // Get recent AQI values for moving average
    const recentAQI = historicalData.slice(-5).map((d) => d.aqi)
    const avgAQI = recentAQI.reduce((sum, aqi) => sum + aqi, 0) / recentAQI.length

    // Apply time-based factors
    const hour = futureTime.getHours()
    let timeFactor = 1

    // Morning rush hour (7-10 AM)
    if (hour >= 7 && hour <= 10) timeFactor = 1.3
    // Evening rush hour (5-8 PM)
    else if (hour >= 17 && hour <= 20) timeFactor = 1.4
    // Night time (10 PM - 6 AM)
    else if (hour >= 22 || hour <= 6) timeFactor = 0.8

    // Apply seasonal factors (mock)
    let seasonalFactor = 1
    const month = futureTime.getMonth()
    if (month >= 10 || month <= 2) seasonalFactor = 1.5 // Winter months

    // Add some randomness for realistic variation
    const randomFactor = 0.9 + Math.random() * 0.2

    const predictedAQI = Math.round(avgAQI * timeFactor * seasonalFactor * randomFactor)

    // Determine weather factor
    let weatherFactor = "Normal"
    if (i < 24 && Math.random() > 0.7) weatherFactor = "High Wind"
    else if (i >= 24 && i < 48 && Math.random() > 0.8) weatherFactor = "Rain Expected"
    else if (i >= 48 && Math.random() > 0.6) weatherFactor = "Stable Conditions"

    // Determine main pollutant based on AQI level
    let mainPollutant = "PM2.5"
    if (predictedAQI > 200) mainPollutant = "PM10"
    else if (predictedAQI > 150 && Math.random() > 0.5) mainPollutant = "NO2"

    // Calculate confidence (higher for near-term, lower for long-term)
    const confidence = Math.max(60, 95 - i * 0.5)

    forecast.push({
      timestamp: futureTime.toISOString(),
      aqi: Math.max(20, Math.min(500, predictedAQI)),
      mainPollutant,
      confidence: Math.round(confidence),
      weatherFactor,
    })
  }

  return forecast
}

export function generateHistoricalData(): HistoricalData[] {
  const historical: HistoricalData[] = []
  const now = new Date()

  // Generate 7 days of historical data
  for (let i = 168; i >= 0; i--) {
    // 168 hours = 7 days
    const pastTime = new Date(now.getTime() - i * 60 * 60 * 1000)

    // Base AQI with daily and seasonal patterns
    const hour = pastTime.getHours()
    const dayOfWeek = pastTime.getDay()

    let baseAQI = 120 // Base Delhi AQI

    // Daily pattern
    if (hour >= 7 && hour <= 10)
      baseAQI += 40 // Morning rush
    else if (hour >= 17 && hour <= 20)
      baseAQI += 50 // Evening rush
    else if (hour >= 22 || hour <= 6) baseAQI -= 30 // Night time

    // Weekend effect
    if (dayOfWeek === 0 || dayOfWeek === 6) baseAQI -= 20

    // Add randomness
    const randomVariation = (Math.random() - 0.5) * 60
    const finalAQI = Math.max(30, Math.min(400, baseAQI + randomVariation))

    // Calculate pollutant concentrations based on AQI
    const pm25 = Math.round(finalAQI * 0.6 + Math.random() * 20)
    const pm10 = Math.round(finalAQI * 0.8 + Math.random() * 30)

    // Mock weather data
    const temperature = 20 + Math.random() * 15 // 20-35°C
    const humidity = 40 + Math.random() * 40 // 40-80%
    const windSpeed = 2 + Math.random() * 8 // 2-10 km/h

    historical.push({
      timestamp: pastTime.toISOString(),
      aqi: Math.round(finalAQI),
      pm25,
      pm10,
      temperature: Math.round(temperature),
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 10) / 10,
    })
  }

  return historical
}

export function getAQITrend(data: (HistoricalData | ForecastData)[]): "improving" | "worsening" | "stable" {
  if (data.length < 2) return "stable"

  const recent = data.slice(-6).map((d) => d.aqi)
  const earlier = data.slice(-12, -6).map((d) => d.aqi)

  const recentAvg = recent.reduce((sum, aqi) => sum + aqi, 0) / recent.length
  const earlierAvg = earlier.reduce((sum, aqi) => sum + aqi, 0) / earlier.length

  const difference = recentAvg - earlierAvg

  if (difference > 10) return "worsening"
  if (difference < -10) return "improving"
  return "stable"
}
