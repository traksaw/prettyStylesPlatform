"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Camera, CheckCircle, AlertCircle } from "lucide-react"
import { useReviews } from "@/lib/review-context"

interface ReviewFormProps {
  bookingId: string
  serviceName: string
  onReviewSubmitted?: () => void
}

export default function ReviewForm({ bookingId, serviceName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const { submitReview } = useReviews()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await submitReview(bookingId, rating, comment)
      setSubmitted(true)
      onReviewSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-700">Your review has been submitted successfully.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-pink-200">
      <CardHeader className="bg-pink-50">
        <CardTitle className="text-pink-700">Leave a Review</CardTitle>
        <p className="text-sm text-gray-600">Share your experience with {serviceName}</p>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium">Rating</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Tell us about your experience... How was the service? The quality? Would you recommend us?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Add Photos (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload photos of your new hairstyle</p>
              <p className="text-xs text-gray-500 mt-1">Coming soon!</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
