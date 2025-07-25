"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Info, CheckCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppleSignInManager } from "@/lib/apple-signin"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState("")
  const [resendLoading, setResendLoading] = useState(false)

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    user,
    loading: authLoading,
  } = useAuth()
  const router = useRouter()
  const loading = authLoading || isLoading

  // Add this useEffect right after the existing useEffect
  useEffect(() => {
    // If user is already signed in, redirect them
    if (!loading && user) {
      console.log("User already signed in, redirecting to account...")
      router.push("/account")
    }
  }, [user, loading, router])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("confirmed") === "true") {
      setError("")
      // Show a success message
      const successAlert = document.createElement("div")
      successAlert.className =
        "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50"
      successAlert.innerHTML = "✅ Email confirmed! You can now sign in."
      document.body.appendChild(successAlert)

      setTimeout(() => {
        document.body.removeChild(successAlert)
      }, 5000)
    }
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match")
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }

        try {
          await signUp(email, password, firstName, lastName)
          // If we get here, signup was successful and user is signed in immediately
          router.push("/account")
        } catch (signUpError) {
          const errorMessage = signUpError instanceof Error ? signUpError.message : "Failed to create account"

          // Check if it's an email confirmation error
          if (errorMessage.includes("check your email")) {
            // Show success message and switch to confirmation view
            setError("")
            setEmailSent(true)
            setConfirmationEmail(email)
          } else {
            setError(errorMessage)
          }
        }
      } else {
        await signIn(email, password)
        router.push("/account")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setResendLoading(true)
    setError("")

    try {
      await signUp(confirmationEmail, password, firstName, lastName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend confirmation"
      if (!errorMessage.includes("check your email")) {
        setError(errorMessage)
      }
    } finally {
      setResendLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "google" | "facebook" | "apple") => {
    setError("")
    setIsLoading(true)

    try {
      switch (provider) {
        case "google":
          await signInWithGoogle()
          break
        case "facebook":
          await signInWithFacebook()
          break
        case "apple":
          // Check if Apple Sign-In is recommended for this device
          const appleManager = AppleSignInManager.getInstance()
          if (!appleManager.isAvailable()) {
            setError(appleManager.getRecommendation())
            return
          }
          await signInWithApple()
          break
      }
      router.push("/account")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Social sign-in failed"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Show email confirmation screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border-pink-200 shadow-lg">
            <CardHeader className="bg-pink-50 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-pink-700">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Created Successfully!</h3>
                  <p className="text-gray-600">We've sent a confirmation link to:</p>
                  <p className="font-semibold text-pink-600 mt-1">{confirmationEmail}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                  <ol className="text-sm text-blue-700 text-left space-y-1">
                    <li>1. Check your email inbox</li>
                    <li>2. Look for an email from Supabase</li>
                    <li>3. Click the "Confirm your email" link</li>
                    <li>4. Return here to sign in</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Didn't receive the email? Check your spam folder or:</p>

                  <Button
                    onClick={handleResendConfirmation}
                    variant="outline"
                    className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                    disabled={resendLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${resendLoading ? "animate-spin" : ""}`} />
                    {resendLoading ? "Sending..." : "Resend Confirmation Email"}
                  </Button>

                  <Button
                    onClick={() => {
                      setEmailSent(false)
                      setIsSignUp(false)
                      setError("")
                    }}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    Back to Sign In
                  </Button>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p className="text-gray-600">
            {isSignUp ? "Join PrettyStyles to book your appointments" : "Sign in to manage your appointments"}
          </p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-700 text-center">{isSignUp ? "Sign Up" : "Sign In"}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Confirmation Notice for Sign Up */}
            {isSignUp && (
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Email Verification Required:</strong> After creating your account, you'll need to verify your
                  email address before you can sign in.
                </AlertDescription>
              </Alert>
            )}

            {/* Apple Sign-In Notice */}
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Apple Sign-In:</strong> Works best on Safari browser or iOS devices.
                {process.env.NODE_ENV === "development" && " (Development mode uses mock authentication)"}
              </AlertDescription>
            </Alert>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
                onClick={() => handleSocialAuth("google")}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
                onClick={() => handleSocialAuth("facebook")}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>

              <Button
                type="button"
                variant="outline"
                className={`w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent ${
                  !AppleSignInManager.getInstance().isAvailable() ? "opacity-60" : ""
                }`}
                onClick={() => handleSocialAuth("apple")}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3" fill="#000000" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Continue with Apple
                {!AppleSignInManager.getInstance().isAvailable() && (
                  <span className="text-xs text-gray-500 ml-2">(Recommended for Safari/iOS)</span>
                )}
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

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

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-sm text-pink-600 hover:text-pink-700">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 h-12" disabled={loading}>
                {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
