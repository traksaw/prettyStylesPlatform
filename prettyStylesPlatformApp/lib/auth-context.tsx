"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { supabase, type User } from "./supabase"
import type { AuthError, User as SupabaseUser } from "@supabase/supabase-js"

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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchUserProfile(session.user)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).single()

      if (error && error.code === "PGRST116") {
        // User doesn't exist in our users table, create them
        const newUser = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          first_name: supabaseUser.user_metadata?.first_name || "User",
          last_name: supabaseUser.user_metadata?.last_name || "",
          avatar_url: supabaseUser.user_metadata?.avatar_url,
          provider: supabaseUser.app_metadata?.provider || "email",
        }

        const { data: createdUser, error: createError } = await supabase
          .from("users")
          .insert([newUser])
          .select()
          .single()

        if (createError) throw createError
        setUser(createdUser)
      } else if (error) {
        throw error
      } else {
        setUser(data)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const handlePostAuthRedirect = () => {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      handlePostAuthRedirect()
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) throw error

      // Note: User will need to confirm email before they can sign in
      // You might want to show a "check your email" message
      handlePostAuthRedirect()
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message || "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signInWithFacebook = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message || "Facebook sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message || "Apple sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message || "Failed to send reset email")
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
