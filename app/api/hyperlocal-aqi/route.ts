import { NextResponse } from "next/server"
import { getIoTSensorManager } from "@/lib/iot-sensors"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '28.6139')
    const lon = parseFloat(searchParams.get('lon') || '77.209')
    const radius = parseFloat(searchParams.get('radius') || '5')

    const iotManager = getIoTSensorManager()
    const hyperlocalAQI = await iotManager.getHyperlocalAQI(lat, lon, radius)

    return NextResponse.json(hyperlocalAQI)
  } catch (error) {
    console.error("Failed to fetch hyperlocal AQI:", error)
    return NextResponse.json(
      { error: "Failed to fetch hyperlocal AQI" },
      { status: 500 }
    )
  }
}
