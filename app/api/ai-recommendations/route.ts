import { NextResponse } from "next/server"
import { getAIRecommendationEngine } from "@/lib/ai-recommendations"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currentAQI = parseInt(searchParams.get('aqi') || '150')
    const category = searchParams.get('category')

    const aiEngine = getAIRecommendationEngine()
    
    // Mock weather data and historical data
    const weatherData = {
      temperature: 28,
      humidity: 65,
      windSpeed: 3.2,
      windDirection: 180
    }
    
    const historicalData = [
      { aqi: 160, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { aqi: 155, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { aqi: 150, timestamp: new Date().toISOString() }
    ]

    let recommendations
    if (category) {
      recommendations = await aiEngine.getRecommendationsByCategory(category)
    } else {
      recommendations = await aiEngine.generateRecommendations(currentAQI, weatherData, historicalData)
    }

    const priorityRecommendations = await aiEngine.getPriorityRecommendations()
    const optimizationSuggestions = await aiEngine.getOptimizationSuggestions()

    return NextResponse.json({
      recommendations,
      priorityRecommendations,
      optimizationSuggestions
    })
  } catch (error) {
    console.error("Failed to fetch AI recommendations:", error)
    return NextResponse.json(
      { error: "Failed to fetch AI recommendations" },
      { status: 500 }
    )
  }
}
