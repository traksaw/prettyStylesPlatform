"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/auth?error=callback_failed")
          return
        }

        if (data.session) {
          // Check if user was trying to book before authentication
          const shouldRedirectToBooking = sessionStorage.getItem("booking_redirect")
          if (shouldRedirectToBooking) {
            sessionStorage.removeItem("booking_redirect")
            router.push("/booking")
          } else {
            router.push("/account")
          }
        } else {
          router.push("/auth")
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error)
        router.push("/auth?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  )
}
