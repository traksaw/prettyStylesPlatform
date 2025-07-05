"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Review {
  id: string
  bookingId: string
  userId: string
  userName: string
  userAvatar?: string
  serviceName: string
  rating: number
  comment: string
  photos?: string[]
  createdAt: Date
  helpful: number
  verified: boolean
}

interface ReviewContextType {
  reviews: Review[]
  submitReview: (bookingId: string, rating: number, comment: string, photos?: string[]) => Promise<void>
  getReviewsForService: (serviceName: string) => Review[]
  getAverageRating: () => number
  canUserReview: (bookingId: string, userId: string) => boolean
  getUserReview: (bookingId: string, userId: string) => Review | null
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // Load reviews from localStorage (in real app, this would be from your API)
    const savedReviews = localStorage.getItem("customer_reviews")
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews).map((review: any) => ({
        ...review,
        createdAt: new Date(review.createdAt),
      }))
      setReviews(parsedReviews)
    }
  }, [])

  const submitReview = async (bookingId: string, rating: number, comment: string, photos?: string[]) => {
    try {
      // Get user and booking info
      const userData = localStorage.getItem("user_data")
      const bookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")

      if (!userData) throw new Error("User not authenticated")

      const user = JSON.parse(userData)
      const booking = bookings.find((b: any) => b.id === bookingId)

      if (!booking) throw new Error("Booking not found")

      const newReview: Review = {
        id: "review_" + Date.now(),
        bookingId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userAvatar: user.avatar,
        serviceName: booking.service.name,
        rating,
        comment,
        photos: photos || [],
        createdAt: new Date(),
        helpful: 0,
        verified: true, // Since it's from a real booking
      }

      const updatedReviews = [...reviews, newReview]
      setReviews(updatedReviews)

      // Save to localStorage
      localStorage.setItem("customer_reviews", JSON.stringify(updatedReviews))

      // Mark booking as reviewed
      const updatedBookings = bookings.map((b: any) => (b.id === bookingId ? { ...b, reviewed: true } : b))
      localStorage.setItem("user_bookings", JSON.stringify(updatedBookings))
    } catch (error) {
      throw new Error("Failed to submit review")
    }
  }

  const getReviewsForService = (serviceName: string) => {
    return reviews.filter((review) => review.serviceName.includes(serviceName))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 5.0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return Math.round((total / reviews.length) * 10) / 10
  }

  const canUserReview = (bookingId: string, userId: string) => {
    // Check if user already reviewed this booking
    const existingReview = reviews.find((r) => r.bookingId === bookingId && r.userId === userId)
    return !existingReview
  }

  const getUserReview = (bookingId: string, userId: string) => {
    return reviews.find((r) => r.bookingId === bookingId && r.userId === userId) || null
  }

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        submitReview,
        getReviewsForService,
        getAverageRating,
        canUserReview,
        getUserReview,
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
