"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token from URL parameters
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token_hash || type !== "email") {
          throw new Error("Invalid confirmation link")
        }

        // Verify the email confirmation
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: "email",
        })

        if (error) throw error

        if (data.user) {
          setStatus("success")
          setMessage("Your email has been confirmed successfully!")

          // Redirect to sign in page after 3 seconds
          setTimeout(() => {
            router.push("/auth?confirmed=true")
          }, 3000)
        } else {
          throw new Error("Email confirmation failed")
        }
      } catch (error) {
        console.error("Email confirmation error:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Email confirmation failed")
      }
    }

    handleEmailConfirmation()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-pink-200 shadow-lg">
        <CardHeader className="bg-pink-50 text-center">
          <CardTitle className="text-pink-700">Email Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirming Your Email</h3>
                <p className="text-gray-600">Please wait while we verify your email address...</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Email Confirmed!</h3>
                <p className="text-green-700 mb-4">{message}</p>
                <p className="text-sm text-gray-500">You can now sign in to your account.</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting you to sign in...</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Confirmation Failed</h3>
                <p className="text-red-700 mb-4">{message}</p>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
                    <Link href="/auth">Try Signing In</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
