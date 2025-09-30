import { NextResponse } from "next/server"
import { getSatelliteManager } from "@/lib/satellite"

export async function GET() {
  try {
    const satelliteManager = getSatelliteManager()
    const [satelliteData, stubbleEvents] = await Promise.all([
      satelliteManager.getAllSatelliteData(),
      satelliteManager.getStubbleBurningEvents()
    ])

    return NextResponse.json({
      satelliteData,
      stubbleEvents,
      cacheStatus: satelliteManager.getCacheStatus()
    })
  } catch (error) {
    console.error("Failed to fetch satellite data:", error)
    return NextResponse.json(
      { error: "Failed to fetch satellite data" },
      { status: 500 }
    )
  }
}
