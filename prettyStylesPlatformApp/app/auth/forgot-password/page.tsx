"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/auth" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Sign In
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-700 text-center">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setSuccess(false)
                        setEmail("")
                      }}
                      className="text-pink-600 hover:text-pink-700 underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 h-12" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
