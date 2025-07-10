"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AppleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signOut } = useAuth()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`Apple Sign-In error: ${error}`)
        }

        if (!code || !state) {
          throw new Error("Missing required parameters from Apple")
        }

        // In a real app, you would:
        // 1. Send the authorization code to your backend
        // 2. Your backend would exchange it for tokens with Apple
        // 3. Verify the ID token and create/update user in your database
        // 4. Return user data and session token

        // For demo purposes, we'll simulate this process
        setMessage("Processing Apple Sign-In...")
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate successful authentication
        const userData = {
          id: `apple_${Date.now()}`,
          email: "user@privaterelay.appleid.com",
          firstName: "Apple",
          lastName: "User",
          provider: "apple" as const,
        }

        localStorage.setItem("auth_token", `apple_token_${Date.now()}`)
        localStorage.setItem("user_data", JSON.stringify(userData))

        setStatus("success")
        setMessage("Successfully signed in with Apple!")

        // Redirect after success
        setTimeout(() => {
          const shouldRedirectToBooking = sessionStorage.getItem("booking_redirect")
          if (shouldRedirectToBooking) {
            sessionStorage.removeItem("booking_redirect")
            router.push("/booking")
          } else {
            router.push("/account")
          }
        }, 2000)
      } catch (error) {
        console.error("Apple callback error:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Apple Sign-In failed")

        // Redirect to auth page after error
        setTimeout(() => {
          router.push("/auth")
        }, 3000)
      }
    }

    handleAppleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-pink-200 shadow-lg">
        <CardHeader className="bg-pink-50 text-center">
          <CardTitle className="text-pink-700">Apple Sign-In</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          {status === "processing" && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing...</h3>
                <p className="text-gray-600">{message}</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Success!</h3>
                <p className="text-green-700">{message}</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting you now...</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{message}</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting to sign-in page...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
