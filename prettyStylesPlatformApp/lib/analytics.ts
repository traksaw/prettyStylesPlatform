export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Optional: Add your own analytics tracking here
  console.log("Event tracked:", eventName, properties)
}

export function trackPageView(page: string) {
  // Optional: Add your own page view tracking here
  console.log("Page view tracked:", page)
}

// Export empty components if they're used in your layout
export function Analytics() {
  return null
}

export function SpeedInsights() {
  return null
}
