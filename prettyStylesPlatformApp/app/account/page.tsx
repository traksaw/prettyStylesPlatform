"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CreditCard, User, Settings, Plus, Star, MessageSquare, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useReviews } from "@/lib/review-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReviewForm from "@/app/components/ReviewForm"
import RescheduleModal from "@/app/components/RescheduleModal"
import CancelModal from "@/app/components/CancelModal"

export default function AccountPage() {
  const { user, loading } = useAuth()
  const { canUserReview, getUserReview } = useReviews()
  const { toast } = useToast()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = () => {
    if (!user) return
    // Load user bookings from localStorage (in real app, this would be from your API)
    const userBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
    const filteredBookings = userBookings.filter((booking: any) => booking.userId === user.id)
    setBookings(filteredBookings)
  }

  const handleReschedule = async (bookingId: string, newDate: Date, newTime: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update booking in localStorage
      const userBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
      const updatedBookings = userBookings.map((booking: any) => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            date: newDate.toISOString(),
            time: newTime,
            status: "rescheduled",
            rescheduledAt: new Date().toISOString(),
          }
        }
        return booking
      })

      localStorage.setItem("user_bookings", JSON.stringify(updatedBookings))
      loadBookings()

      toast({
        title: "Appointment Rescheduled",
        description: `Your appointment has been moved to ${newDate.toLocaleDateString()} at ${newTime}`,
      })
    } catch (error) {
      throw new Error("Failed to reschedule appointment. Please try again.")
    }
  }

  const handleCancel = async (bookingId: string, reason?: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update booking in localStorage
      const userBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
      const updatedBookings = userBookings.map((booking: any) => {
        if (booking.id === bookingId) {
          const appointmentDate = new Date(booking.date)
          const now = new Date()
          const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
          const depositRefundable = hoursUntilAppointment >= 24

          return {
            ...booking,
            status: "cancelled",
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason,
            depositRefunded: depositRefundable,
          }
        }
        return booking
      })

      localStorage.setItem("user_bookings", JSON.stringify(updatedBookings))
      loadBookings()

      const booking = bookings.find((b) => b.id === bookingId)
      const appointmentDate = new Date(booking.date)
      const now = new Date()
      const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      const depositRefundable = hoursUntilAppointment >= 24

      toast({
        title: "Appointment Cancelled",
        description: depositRefundable
          ? `Your appointment has been cancelled and your $${booking.depositPaid} deposit will be refunded.`
          : `Your appointment has been cancelled. Deposit forfeited due to 24-hour policy.`,
      })
    } catch (error) {
      throw new Error("Failed to cancel appointment. Please try again.")
    }
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(null)
    loadBookings()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.date) >= new Date() && booking.status !== "cancelled",
  )
  const pastBookings = bookings.filter(
    (booking) => new Date(booking.date) < new Date() && booking.status !== "cancelled",
  )
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled")

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Account</h1>
              <p className="text-gray-600">Manage your appointments and account settings</p>
            </div>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link href="/booking">
                <Plus className="w-4 h-4 mr-2" />
                Book New Appointment
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-pink-200">
              <CardHeader className="bg-pink-50">
                <CardTitle className="flex items-center text-pink-700">
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="bg-pink-200 text-pink-600 text-2xl">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user.provider === "email" ? "Email Account" : `${user.provider} Account`}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200 mt-6">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{bookings.length}</div>
                    <div className="text-sm text-gray-600">Total Appointments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{upcomingBookings.length}</div>
                    <div className="text-sm text-gray-600">Upcoming</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{pastBookings.length}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  {cancelledBookings.length > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{cancelledBookings.length}</div>
                      <div className="text-sm text-gray-600">Cancelled</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-8">
              <Card className="border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="flex items-center justify-between text-pink-700">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Upcoming Appointments
                    </div>
                    {upcomingBookings.length === 0 && (
                      <Button asChild size="sm" className="bg-pink-500 hover:bg-pink-600">
                        <Link href="/booking">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="border border-pink-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-800">{booking.service.name}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(booking.date)} at {booking.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.service.duration}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                className={`${
                                  booking.status === "rescheduled"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {booking.status === "rescheduled" ? "Rescheduled" : "Confirmed"}
                              </Badge>
                              {booking.status === "rescheduled" && (
                                <p className="text-xs text-blue-600">Moved from original date</p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-sm text-gray-600">
                              Deposit paid: ${booking.depositPaid} • Remaining: ${booking.remainingBalance}
                            </div>
                            <div className="flex gap-2">
                              <RescheduleModal booking={booking} onReschedule={handleReschedule}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                                >
                                  Reschedule
                                </Button>
                              </RescheduleModal>
                              <CancelModal booking={booking} onCancel={handleCancel}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                                >
                                  Cancel
                                </Button>
                              </CancelModal>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No upcoming appointments</h3>
                      <p className="text-gray-600 mb-4">Ready to book your next beautiful hairstyle?</p>
                      <Button asChild className="bg-pink-500 hover:bg-pink-600">
                        <Link href="/booking">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Your First Appointment
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {pastBookings.length > 0 && (
                <Card className="border-pink-200">
                  <CardHeader className="bg-pink-50">
                    <CardTitle className="flex items-center text-pink-700">
                      <Clock className="w-5 h-5 mr-2" />
                      Appointment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {pastBookings.map((booking) => {
                        const canReview = user && canUserReview(booking.id, user.id)
                        const existingReview = user && getUserReview(booking.id, user.id)
                        const isShowingReviewForm = showReviewForm === booking.id

                        return (
                          <div key={booking.id} className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{booking.service.name}</h4>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(booking.date)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">Completed</Badge>
                                  {existingReview && (
                                    <Badge className="bg-yellow-100 text-yellow-700">
                                      <Star className="w-3 h-3 mr-1" />
                                      Reviewed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-3">
                                <p className="text-sm text-gray-600">Total: ${booking.service.price} • Paid in full</p>
                                <div className="flex gap-2">
                                  {canReview && !isShowingReviewForm && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowReviewForm(booking.id)}
                                      className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                                    >
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Leave Review
                                    </Button>
                                  )}
                                  {existingReview && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                      {existingReview.rating}/5 stars
                                    </div>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                                  >
                                    Book Again
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {isShowingReviewForm && (
                              <ReviewForm
                                bookingId={booking.id}
                                serviceName={booking.service.name}
                                onReviewSubmitted={handleReviewSubmitted}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {cancelledBookings.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center text-red-700">
                      <X className="w-5 h-5 mr-2" />
                      Cancelled Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {cancelledBookings.map((booking) => (
                        <div key={booking.id} className="border border-red-200 rounded-lg p-4 bg-red-50/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-800">{booking.service.name}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(booking.date)} at {booking.time}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Cancelled on {formatDate(booking.cancelledAt)}
                              </div>
                            </div>
                            <Badge variant="destructive">Cancelled</Badge>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-sm text-gray-600">
                              Deposit: ${booking.depositPaid} •
                              {booking.depositRefunded ? (
                                <span className="text-green-600 ml-1">Refunded</span>
                              ) : (
                                <span className="text-red-600 ml-1">Forfeited</span>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                            >
                              Book Again
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="flex items-center text-pink-700">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">•••• •••• •••• 4567</p>
                            <p className="text-sm text-gray-600">Expires 12/26</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Default</Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                    >
                      Add New Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
