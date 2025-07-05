"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, CheckCircle } from "lucide-react"
import { useReviews } from "@/lib/review-context"

export default function ReviewsSection() {
  const { reviews, getAverageRating } = useReviews()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const averageRating = getAverageRating()
  const totalReviews = reviews.length

  if (reviews.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <p className="text-gray-600">Be the first to leave a review after your appointment!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
            </div>
            <div className="text-gray-600">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((review) => (
              <Card key={review.id} className="border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          {review.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" title="Verified Customer" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="mb-3 bg-pink-100 text-pink-700">
                    {review.serviceName}
                  </Badge>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`Review photo ${index + 1}`}
                          className="rounded-lg object-cover h-24 w-full"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
