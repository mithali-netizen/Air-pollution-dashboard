"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getNotificationManager } from "@/lib/notifications"
import { Bell, BellOff, AlertTriangle } from "lucide-react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    enabled: false,
    aqiThreshold: 150,
    healthAlerts: true,
    forecastAlerts: true,
    emergencyAlerts: true,
  })
  const [permissionStatus, setPermissionStatus] = useState("default")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const manager = getNotificationManager()
    setSettings(manager.getSettings())

    if ("Notification" in window) {
      setPermissionStatus(Notification.permission)
    }
  }, [])

  const handleEnableNotifications = async () => {
    if (!mounted) return
    const manager = getNotificationManager()
    const granted = await manager.requestPermission()
    if (granted) {
      setPermissionStatus("granted")
      setSettings({ ...settings, enabled: true })
    }
  }

  const handleSettingChange = (key, value) => {
    if (!mounted) return
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    const manager = getNotificationManager()
    manager.updateSettings(newSettings)
  }

  const getAQILabel = (value) => {
    if (value <= 50) return "Good"
    if (value <= 100) return "Moderate"
    if (value <= 150) return "Unhealthy for Sensitive"
    if (value <= 200) return "Unhealthy"
    if (value <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Configure air quality alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {permissionStatus !== "granted" ? (
          <div className="text-center py-6">
            <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Enable Notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get instant alerts when air quality changes in your area
            </p>
            <Button onClick={handleEnableNotifications}>
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications-enabled" className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive air quality alerts on this device</p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
              />
            </div>

            {settings.enabled && (
              <>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Alert Threshold</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when AQI exceeds: {settings.aqiThreshold} ({getAQILabel(settings.aqiThreshold)})
                  </p>
                  <Slider
                    value={[settings.aqiThreshold]}
                    onValueChange={([value]) => handleSettingChange("aqiThreshold", value)}
                    max={300}
                    min={50}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50 (Good)</span>
                    <span>150 (Unhealthy)</span>
                    <span>300 (Hazardous)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Alert Types</Label>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="health-alerts" className="font-medium">
                        Health Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Real-time AQI threshold notifications</p>
                    </div>
                    <Switch
                      id="health-alerts"
                      checked={settings.healthAlerts}
                      onCheckedChange={(checked) => handleSettingChange("healthAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="forecast-alerts" className="font-medium">
                        Forecast Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Daily air quality predictions</p>
                    </div>
                    <Switch
                      id="forecast-alerts"
                      checked={settings.forecastAlerts}
                      onCheckedChange={(checked) => handleSettingChange("forecastAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emergency-alerts" className="font-medium">
                        Emergency Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">Critical air quality warnings</p>
                    </div>
                    <Switch
                      id="emergency-alerts"
                      checked={settings.emergencyAlerts}
                      onCheckedChange={(checked) => handleSettingChange("emergencyAlerts", checked)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-medium text-sm">Test Notification</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Send a test notification to verify your settings</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (mounted) {
                        const manager = getNotificationManager()
                        manager.sendAQIAlert(180, "Delhi-NCR")
                      }
                    }}
                  >
                    Send Test Alert
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
