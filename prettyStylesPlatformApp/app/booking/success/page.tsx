"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Clock, CreditCard, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function BookingSuccessPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking")
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (bookingId) {
      // In a real app, you'd fetch the booking from your API
      const bookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
      const foundBooking = bookings.find((b: any) => b.id === bookingId)
      setBooking(foundBooking)
    }
  }, [bookingId])

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  const formatDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your appointment has been successfully booked</p>
        </div>

        <Card className="border-pink-200 shadow-lg mb-8">
          <CardHeader className="bg-pink-50">
            <CardTitle className="flex items-center text-pink-700">
              <Calendar className="w-5 h-5 mr-2" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{booking.service.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {booking.service.duration}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">{booking.status}</Badge>
              </div>

              <div className="border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Date & Time</h4>
                    <p className="text-gray-600">{formatDate(booking.date)}</p>
                    <p className="text-gray-600">at {booking.time}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Customer</h4>
                    <p className="text-gray-600">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Total:</span>
                    <span>${booking.service.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>Deposit Paid:</span>
                    <span>${booking.depositPaid}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining Balance:</span>
                    <span>${booking.remainingBalance}</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Remaining balance of ${booking.remainingBalance} is due at your appointment
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 mb-8">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-700">Important Reminders</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Come with clean, detangled hair
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Bring snacks and entertainment for longer sessions
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Please arrive on time to ensure full service
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                24-hour notice required for cancellations
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 bg-pink-500 hover:bg-pink-600">
            <Link href="/account">
              <User className="w-4 h-4 mr-2" />
              View My Appointments
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
