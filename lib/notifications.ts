export interface NotificationSettings {
  enabled: boolean
  aqiThreshold: number
  healthAlerts: boolean
  forecastAlerts: boolean
  emergencyAlerts: boolean
}

export class NotificationManager {
  private static instance: NotificationManager
  private settings: NotificationSettings

  private constructor() {
    this.settings = this.loadSettings()
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  private loadSettings(): NotificationSettings {
    if (typeof window === "undefined") {
      return {
        enabled: false,
        aqiThreshold: 150,
        healthAlerts: true,
        forecastAlerts: true,
        emergencyAlerts: true,
      }
    }

    const saved = localStorage.getItem("notification-settings")
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      enabled: false,
      aqiThreshold: 150,
      healthAlerts: true,
      forecastAlerts: true,
      emergencyAlerts: true,
    }
  }

  private saveSettings(): void {
    if (typeof window === "undefined") return
    localStorage.setItem("notification-settings", JSON.stringify(this.settings))
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      this.settings.enabled = true
      this.saveSettings()
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        this.settings.enabled = true
        this.saveSettings()
        return true
      }
    }

    return false
  }

  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    this.saveSettings()
  }

  async sendAQIAlert(aqi: number, location: string): Promise<void> {
    if (!this.settings.enabled || !this.settings.healthAlerts) return
    if (aqi < this.settings.aqiThreshold) return

    const title = "Air Quality Alert"
    let body = ""
    const icon = "/icon-192.png"

    if (aqi <= 100) {
      body = `Moderate air quality in ${location}. AQI: ${aqi}`
    } else if (aqi <= 150) {
      body = `Unhealthy air for sensitive groups in ${location}. AQI: ${aqi}`
    } else if (aqi <= 200) {
      body = `Unhealthy air quality in ${location}. AQI: ${aqi}. Limit outdoor activities.`
    } else if (aqi <= 300) {
      body = `Very unhealthy air in ${location}. AQI: ${aqi}. Avoid outdoor activities.`
    } else {
      body = `Hazardous air quality in ${location}. AQI: ${aqi}. Emergency conditions!`
    }

    this.showNotification(title, body, icon)
  }

  async sendForecastAlert(message: string): Promise<void> {
    if (!this.settings.enabled || !this.settings.forecastAlerts) return

    this.showNotification("Air Quality Forecast", message, "/icon-192.png")
  }

  async sendEmergencyAlert(message: string): Promise<void> {
    if (!this.settings.enabled || !this.settings.emergencyAlerts) return

    this.showNotification("Emergency Alert", message, "/icon-192.png", {
      requireInteraction: true,
      tag: "emergency",
    })
  }

  private showNotification(title: string, body: string, icon: string, options: NotificationOptions = {}): void {
    if (typeof window === "undefined" || Notification.permission !== "granted") return

    const notification = new Notification(title, {
      body,
      icon,
      badge: "/icon-192.png",
      tag: "cleanair-alert",
      renotify: true,
      ...options,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Auto close after 10 seconds unless it requires interaction
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 10000)
    }
  }

  startMonitoring(getCurrentAQI: () => Promise<number>): void {
    if (typeof window === "undefined" || !this.settings.enabled) return

    // Check AQI every 5 minutes
    setInterval(
      async () => {
        try {
          const aqi = await getCurrentAQI()
          await this.sendAQIAlert(aqi, "Delhi-NCR")
        } catch (error) {
          console.error("Failed to check AQI for notifications:", error)
        }
      },
      5 * 60 * 1000,
    )
  }
}

// Export a function instead that creates the instance lazily
export const getNotificationManager = () => {
  if (typeof window === "undefined") {
    // Return a mock manager for SSR
    return {
      getSettings: () => ({
        enabled: false,
        aqiThreshold: 150,
        healthAlerts: true,
        forecastAlerts: true,
        emergencyAlerts: true,
      }),
      requestPermission: async () => false,
      updateSettings: () => {},
      sendAQIAlert: async () => {},
      sendForecastAlert: async () => {},
      sendEmergencyAlert: async () => {},
      startMonitoring: () => {},
    }
  }
  return NotificationManager.getInstance()
}
