"use client"

import { useEffect } from "react"

export default function LoadingOptimizer() {
  useEffect(() => {
    // Optimize font loading performance
    const optimizeFontLoading = () => {
      // Add font-display: swap to any dynamically loaded fonts
      const style = document.createElement("style")
      style.textContent = `
        @font-face {
          font-family: 'Poppins';
          font-display: swap;
        }
        @font-face {
          font-family: 'Dancing Script';
          font-display: swap;
        }
      `
      document.head.appendChild(style)

      // Preload critical fonts for better performance
      const preloadLinks = [
        {
          href: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        {
          href: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
      ]

      preloadLinks.forEach((linkProps) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.href = linkProps.href
        link.as = linkProps.as
        link.type = linkProps.type
        link.crossOrigin = linkProps.crossOrigin
        document.head.appendChild(link)
      })
    }

    // Run optimization after component mounts
    optimizeFontLoading()

    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll("img")
      images.forEach((img) => {
        if (!img.loading) {
          img.loading = "lazy"
        }
        if (!img.decoding) {
          img.decoding = "async"
        }
      })
    }

    // Run image optimization
    optimizeImages()

    // Set up intersection observer for lazy loading
    const observerOptions = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute("data-src")
            imageObserver.unobserve(img)
          }
        }
      })
    }, observerOptions)

    // Observe images with data-src attribute
    const lazyImages = document.querySelectorAll("img[data-src]")
    lazyImages.forEach((img) => imageObserver.observe(img))

    return () => {
      imageObserver.disconnect()
    }
  }, [])

  return null
}
