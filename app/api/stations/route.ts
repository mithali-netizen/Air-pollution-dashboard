import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Generating mock monitoring stations data for Delhi")

    const mockStations = [
      { name: "Anand Vihar", lat: 28.6469, lon: 77.3152 },
      { name: "Punjabi Bagh", lat: 28.6742, lon: 77.1347 },
      { name: "R K Puram", lat: 28.5631, lon: 77.1822 },
      { name: "ITO", lat: 28.6289, lon: 77.2497 },
      { name: "Dwarka", lat: 28.5921, lon: 77.046 },
      { name: "Rohini", lat: 28.7041, lon: 77.1025 },
      { name: "Shadipur", lat: 28.6517, lon: 77.1583 },
      { name: "Mandir Marg", lat: 28.6358, lon: 77.2014 },
      { name: "Lodhi Road", lat: 28.5918, lon: 77.2273 },
      { name: "Najafgarh", lat: 28.6089, lon: 76.9794 },
    ]

    const stations = mockStations.map((station, index) => {
      const aqi = Math.floor(Math.random() * 200) + 80 // 80-280 range (realistic for Delhi)
      const status = getAQIStatus(aqi)

      return {
        id: `station-${index}`,
        name: station.name,
        latitude: station.lat,
        longitude: station.lon,
        aqi,
        status: status.status,
        color: status.color,
      }
    })

    console.log("[v0] Successfully generated", stations.length, "monitoring stations")
    return NextResponse.json(stations)
  } catch (error) {
    console.log("[v0] Error generating stations data:", error)
    return NextResponse.json([])
  }
}

function getAQIStatus(aqi: number): { status: string; color: string } {
  if (aqi <= 50) return { status: "Good", color: "text-success" }
  if (aqi <= 100) return { status: "Moderate", color: "text-warning" }
  if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "text-orange-500" }
  if (aqi <= 200) return { status: "Unhealthy", color: "text-destructive" }
  if (aqi <= 300) return { status: "Very Unhealthy", color: "text-purple-500" }
  return { status: "Hazardous", color: "text-red-700" }
}
