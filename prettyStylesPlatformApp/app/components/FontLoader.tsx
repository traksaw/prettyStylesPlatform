"use client"

import { useEffect, useState } from "react"

export default function FontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true)
        document.documentElement.classList.add("font-loaded")
        document.documentElement.classList.remove("font-loading")
      })
    }

    // Fallback for browsers that don't support document.fonts
    const fallbackTimer = setTimeout(() => {
      setFontsLoaded(true)
      document.documentElement.classList.add("font-loaded")
      document.documentElement.classList.remove("font-loading")
    }, 3000) // 3 second fallback

    // Preload critical fonts
    const preloadFonts = async () => {
      try {
        const poppinsFont = new FontFace(
          "Poppins",
          "url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2)",
          {
            weight: "400",
            style: "normal",
            display: "swap",
          },
        )

        const poppinsBold = new FontFace(
          "Poppins",
          "url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2)",
          {
            weight: "600",
            style: "normal",
            display: "swap",
          },
        )

        await Promise.all([poppinsFont.load(), poppinsBold.load()])

        document.fonts.add(poppinsFont)
        document.fonts.add(poppinsBold)

        setFontsLoaded(true)
        document.documentElement.classList.add("font-loaded")
        document.documentElement.classList.remove("font-loading")
        clearTimeout(fallbackTimer)
      } catch (error) {
        console.warn("Font preloading failed:", error)
        // Continue with fallback fonts
        setFontsLoaded(true)
        document.documentElement.classList.add("font-loaded")
        document.documentElement.classList.remove("font-loading")
      }
    }

    // Set initial loading state
    document.documentElement.classList.add("font-loading")

    // Start font loading
    preloadFonts()

    return () => {
      clearTimeout(fallbackTimer)
    }
  }, [])

  return null // This component doesn't render anything
}
