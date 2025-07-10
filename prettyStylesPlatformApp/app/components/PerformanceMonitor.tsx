"use client"

import { useEffect } from "react"

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor font loading performance
    const monitorFontLoading = () => {
      if ("fonts" in document) {
        const startTime = performance.now()

        document.fonts.ready.then(() => {
          const loadTime = performance.now() - startTime
          console.log(`Fonts loaded in ${loadTime.toFixed(2)}ms`)

          // Report to analytics if available
          if (typeof window !== "undefined" && (window as any).gtag) {
            ;(window as any).gtag("event", "font_load_time", {
              event_category: "Performance",
              event_label: "Font Loading",
              value: Math.round(loadTime),
            })
          }
        })
      }
    }

    // Monitor Core Web Vitals
    const monitorWebVitals = () => {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log("LCP:", lastEntry.startTime)
      })

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        // Fallback for browsers that don't support LCP
        console.log("LCP monitoring not supported")
      }

      // First Input Delay (FID) - measure interactivity
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.log("FID:", entry.processingStart - entry.startTime)
        })
      })

      try {
        fidObserver.observe({ entryTypes: ["first-input"] })
      } catch (e) {
        console.log("FID monitoring not supported")
      }
    }

    // Run monitoring in development only
    if (process.env.NODE_ENV === "development") {
      monitorFontLoading()
      monitorWebVitals()
    }

    // Cleanup function
    return () => {
      // Cleanup observers if needed
    }
  }, [])

  return null
}
