import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ReviewProvider } from "@/lib/review-context"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <AuthProvider>
          <ReviewProvider>{children}</ReviewProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
