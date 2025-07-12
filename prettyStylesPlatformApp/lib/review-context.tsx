"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, type Review } from "./supabase"
import { useAuth } from "./auth-context"

interface ReviewContextType {
  reviews: Review[]
  loading: boolean
  submitReview: (bookingId: string, rating: number, comment: string, photos?: string[]) => Promise<void>
  getReviewsForService: (serviceName: string) => Review[]
  getAverageRating: () => number
  canUserReview: (bookingId: string, userId: string) => boolean
  getUserReview: (bookingId: string, userId: string) => Review | null
  refreshReviews: () => Promise<void>
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error fetching reviews:", error)
        // If table doesn't exist or other DB error, set empty array
        setReviews([])
        return
      }

      setReviews(data || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      // Set empty array on any error to prevent crashes
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const submitReview = async (bookingId: string, rating: number, comment: string, photos?: string[]) => {
    if (!user) throw new Error("User not authenticated")

    try {
      // First, get the booking details
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("service_name")
        .eq("id", bookingId)
        .single()

      if (bookingError) throw bookingError

      const newReview = {
        booking_id: bookingId,
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}`,
        user_avatar: user.avatar_url,
        service_name: booking.service_name,
        rating,
        comment,
        photos: photos || [],
        helpful_count: 0,
        verified: true,
      }

      const { error } = await supabase.from("reviews").insert([newReview])

      if (error) throw error

      // Refresh reviews
      await fetchReviews()
    } catch (error) {
      console.error("Error submitting review:", error)
      throw new Error("Failed to submit review")
    }
  }

  const getReviewsForService = (serviceName: string) => {
    return reviews.filter((review) => review.service_name.includes(serviceName))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 5.0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return Math.round((total / reviews.length) * 10) / 10
  }

  const canUserReview = (bookingId: string, userId: string) => {
    const existingReview = reviews.find((r) => r.booking_id === bookingId && r.user_id === userId)
    return !existingReview
  }

  const getUserReview = (bookingId: string, userId: string) => {
    return reviews.find((r) => r.booking_id === bookingId && r.user_id === userId) || null
  }

  const refreshReviews = async () => {
    await fetchReviews()
  }

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        submitReview,
        getReviewsForService,
        getAverageRating,
        canUserReview,
        getUserReview,
        refreshReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider")
  }
  return context
}
