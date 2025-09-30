import { NextResponse } from "next/server"
import { getIoTSensorManager } from "@/lib/iot-sensors"

export async function GET() {
  try {
    const iotManager = getIoTSensorManager()
    const [sensorData, networkStatus] = await Promise.all([
      iotManager.fetchSensorData(),
      iotManager.getNetworkStatus()
    ])

    return NextResponse.json({
      sensors: sensorData,
      networkStatus
    })
  } catch (error) {
    console.error("Failed to fetch IoT sensor data:", error)
    return NextResponse.json(
      { error: "Failed to fetch IoT sensor data" },
      { status: 500 }
    )
  }
}
