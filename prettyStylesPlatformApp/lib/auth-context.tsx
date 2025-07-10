"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  provider: "email" | "google" | "facebook" | "apple"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // In a real app, you'd validate the token with your backend
          const userData = localStorage.getItem("user_data")
          if (userData) {
            setUser(JSON.parse(userData))
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handlePostAuthRedirect = () => {
    // Check if user was trying to book before authentication
    const shouldRedirectToBooking = sessionStorage.getItem("booking_redirect")
    if (shouldRedirectToBooking) {
      sessionStorage.removeItem("booking_redirect")
      router.push("/booking")
    } else {
      router.push("/account")
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call - replace with your actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: "user_123",
        email,
        firstName: "Sarah",
        lastName: "Johnson",
        provider: "email",
      }

      setUser(userData)
      localStorage.setItem("auth_token", "mock_token_123")
      localStorage.setItem("user_data", JSON.stringify(userData))

      handlePostAuthRedirect()
    } catch (error) {
      throw new Error("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: "user_" + Date.now(),
        email,
        firstName,
        lastName,
        provider: "email",
      }

      setUser(userData)
      localStorage.setItem("auth_token", "mock_token_" + Date.now())
      localStorage.setItem("user_data", JSON.stringify(userData))

      handlePostAuthRedirect()
    } catch (error) {
      throw new Error("Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData: User = {
        id: "google_user_123",
        email: "user@gmail.com",
        firstName: "Google",
        lastName: "User",
        avatar: "/placeholder.svg?height=40&width=40",
        provider: "google",
      }

      setUser(userData)
      localStorage.setItem("auth_token", "google_token_123")
      localStorage.setItem("user_data", JSON.stringify(userData))

      handlePostAuthRedirect()
    } catch (error) {
      throw new Error("Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signInWithFacebook = async () => {
    setLoading(true)
    try {
      // Simulate Facebook OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData: User = {
        id: "facebook_user_123",
        email: "user@facebook.com",
        firstName: "Facebook",
        lastName: "User",
        avatar: "/placeholder.svg?height=40&width=40",
        provider: "facebook",
      }

      setUser(userData)
      localStorage.setItem("auth_token", "facebook_token_123")
      localStorage.setItem("user_data", JSON.stringify(userData))

      handlePostAuthRedirect()
    } catch (error) {
      throw new Error("Facebook sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    setLoading(true)
    try {
      // Check if Apple Sign-In is available
      if (typeof window === "undefined" || !window.AppleID) {
        throw new Error("Apple Sign-In is not available")
      }

      // Configure Apple Sign-In
      await window.AppleID.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "com.prettystyles.signin",
        scope: "name email",
        redirectURI: `${window.location.origin}/auth/apple/callback`,
        state: "signin",
        usePopup: true,
      })

      // Perform Apple Sign-In
      const data = await window.AppleID.auth.signIn()

      if (data.authorization) {
        // Extract user information
        const { code, id_token, state } = data.authorization
        const user_data = data.user || {}

        // In a real app, you'd send this to your backend for verification
        // For now, we'll create a user object from the Apple response
        const userData: User = {
          id: `apple_${Date.now()}`,
          email: user_data.email || "user@privaterelay.appleid.com",
          firstName: user_data.name?.firstName || "Apple",
          lastName: user_data.name?.lastName || "User",
          provider: "apple",
        }

        setUser(userData)
        localStorage.setItem("auth_token", `apple_token_${Date.now()}`)
        localStorage.setItem("user_data", JSON.stringify(userData))

        handlePostAuthRedirect()
      } else {
        throw new Error("Apple Sign-In was cancelled")
      }
    } catch (error) {
      console.error("Apple Sign-In error:", error)

      // Fallback to mock for development/testing
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock Apple Sign-In for development")
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const userData: User = {
          id: "apple_user_dev",
          email: "user@icloud.com",
          firstName: "Apple",
          lastName: "User",
          avatar: "/placeholder.svg?height=40&width=40",
          provider: "apple",
        }

        setUser(userData)
        localStorage.setItem("auth_token", "apple_token_dev")
        localStorage.setItem("user_data", JSON.stringify(userData))

        handlePostAuthRedirect()
      } else {
        throw new Error(error instanceof Error ? error.message : "Apple Sign-In failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
      localStorage.removeItem("user_bookings") // Clear user bookings on sign out
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // In a real app, this would send a reset email
    } catch (error) {
      throw new Error("Failed to send reset email")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
