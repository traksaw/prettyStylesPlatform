import type React from "react"
import type { Metadata } from "next"
import { Poppins, Dancing_Script, Amarante as Matangi } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ReviewProvider } from "@/lib/review-context"
import FontLoader from "./components/FontLoader"
import LoadingOptimizer from "./components/LoadingOptimizer"
import Script from "next/script"

// Main font for body text - clean and modern
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
})

// Decorative font for headings - elegant and feminine
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
  preload: true,
  fallback: ["cursive", "Georgia", "Times New Roman", "serif"],
})

// Brand accent font - unique and stylish for special elements
const matangi = Matangi({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-matangi",
  display: "swap",
  preload: false, // Load on demand for special elements
  fallback: ["system-ui", "Arial", "sans-serif"],
})

export const metadata: Metadata = {
  title: "PrettyStyles - Professional Hair Braiding Services",
  description:
    "Book your appointment for professional knotless braids, stitch braids, and more. Quality hair styling with convenient online booking.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//appleid.cdn-apple.com" />

        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Critical font preloading */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Resource hints for better performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${poppins.variable} ${dancingScript.variable} ${matangi.variable} font-sans antialiased`}>
        {/* Apple Sign-In Script */}
        <Script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          strategy="lazyOnload"
          onLoad={() => {
            console.log("Apple Sign-In script loaded")
          }}
        />

        <FontLoader />
        <LoadingOptimizer />
        <AuthProvider>
          <ReviewProvider>{children}</ReviewProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
