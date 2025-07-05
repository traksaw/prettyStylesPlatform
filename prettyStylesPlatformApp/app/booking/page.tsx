"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CreditCard, User, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

const services = [
  { id: "knotless-jumbo", name: "Knotless Braids - Jumbo", duration: "1.5 hrs", price: 80 },
  { id: "knotless-large", name: "Knotless Braids - Large", duration: "2.5 hrs", price: 95 },
  { id: "knotless-medium", name: "Knotless Braids - Medium", duration: "4 hrs", price: 130 },
  { id: "knotless-small", name: "Knotless Braids - Small", duration: "5.5 hrs", price: 160 },
  { id: "knotless-xsmall", name: "Knotless Braids - XSmall", duration: "6-7 hrs", price: 200 },
  { id: "half-medium", name: "Half Stitch/Half Knotless - Medium", duration: "2 hrs", price: 135 },
  { id: "half-small", name: "Half Stitch/Half Knotless - Small", duration: "3.5 hrs", price: 155 },
  { id: "half-xsmall", name: "Half Stitch/Half Knotless - XSmall", duration: "4.5 hrs", price: 175 },
  { id: "stitch-2", name: "Stitch Braids (2)", duration: "30 min", price: 30 },
  { id: "stitch-4", name: "Stitch Braids (4)", duration: "1 hr", price: 45 },
  { id: "stitch-6", name: "Stitch Braids (6)", duration: "1.5 hrs", price: 55 },
  { id: "stitch-8", name: "Stitch Braids (8)", duration: "4 hrs", price: 65 },
]

const availableTimes = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]

export default function BookingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const depositAmount = selectedServiceData ? Math.round(selectedServiceData.price * 0.5) : 0

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      // Store the intended destination
      sessionStorage.setItem("booking_redirect", "true")
      router.push("/auth")
    }
  }, [user, loading, router])

  // Generate next 14 days for booking
  const getAvailableDates = () => {
    const dates = []
    for (let i = 1; i <= 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleBookingSubmit = async () => {
    if (!user || !selectedServiceData || !selectedDate || !selectedTime) return

    setIsProcessing(true)
    try {
      // Simulate booking creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you'd save the booking to your database here
      const bookingData = {
        id: "booking_" + Date.now(),
        userId: user.id,
        service: selectedServiceData,
        date: selectedDate,
        time: selectedTime,
        status: "confirmed",
        depositPaid: depositAmount,
        remainingBalance: selectedServiceData.price - depositAmount,
        createdAt: new Date(),
      }

      // Store booking in localStorage for demo (in real app, this would be in your database)
      const existingBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
      existingBookings.push(bookingData)
      localStorage.setItem("user_bookings", JSON.stringify(existingBookings))

      // Redirect to success page or account
      router.push("/booking/success?booking=" + bookingData.id)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading while checking authentication
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

  // Show auth required message if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md border-pink-200 shadow-lg">
          <CardHeader className="bg-pink-50 text-center">
            <Lock className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <CardTitle className="text-pink-700">Account Required</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-6">
              You need to create an account or sign in to book appointments. This helps us manage your bookings and
              provide better service.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
                <Link href="/auth">
                  <User className="w-4 h-4 mr-2" />
                  Create Account / Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Welcome back, {user.firstName}! Select your service and preferred time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-pink-200">
              <CardHeader className="bg-pink-50">
                <CardTitle className="flex items-center text-pink-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  Step {step} of 3:{" "}
                  {step === 1 ? "Select Service" : step === 2 ? "Choose Date & Time" : "Payment & Confirmation"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-pink-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-800">
                            Booking for: {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="service">Select Your Service</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a braiding service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - ${service.price} ({service.duration})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedService}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      Continue to Date & Time
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Select Date</Label>
                      {selectedDate && (
                        <p className="text-sm text-pink-600 font-medium mt-1">
                          Selected: {formatSelectedDate(selectedDate)}
                        </p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                        {getAvailableDates().map((date, i) => (
                          <Button
                            key={i}
                            variant={selectedDate?.toDateString() === date.toDateString() ? "default" : "outline"}
                            size="sm"
                            className={`h-16 text-xs flex flex-col justify-center ${
                              selectedDate?.toDateString() === date.toDateString()
                                ? "bg-pink-500 hover:bg-pink-600 text-white"
                                : "border-pink-200 hover:bg-pink-50 bg-transparent"
                            }`}
                            onClick={() => setSelectedDate(date)}
                          >
                            <div className="font-medium">{date.getDate()}</div>
                            <div className="text-xs opacity-75">
                              {date.toLocaleDateString("en-US", { month: "short" })}
                            </div>
                            <div className="text-xs opacity-75">
                              {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Available Times</Label>
                      {selectedTime && (
                        <p className="text-sm text-pink-600 font-medium mt-1">Selected: {selectedTime}</p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            className={`h-12 ${
                              selectedTime === time
                                ? "bg-pink-500 hover:bg-pink-600 text-white"
                                : "border-pink-200 hover:bg-pink-50 bg-transparent"
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 bg-pink-500 hover:bg-pink-600"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-pink-700 mb-2">Payment Required</h3>
                      <p className="text-sm text-gray-600">
                        A 50% deposit of ${depositAmount} is required to secure your appointment. The remaining $
                        {selectedServiceData ? selectedServiceData.price - depositAmount : 0} will be due at your
                        appointment.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="Full name as on card"
                          defaultValue={`${user.firstName} ${user.lastName}`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={isProcessing}>
                        Back
                      </Button>
                      <Button
                        onClick={handleBookingSubmit}
                        className="flex-1 bg-pink-500 hover:bg-pink-600"
                        disabled={isProcessing}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {isProcessing ? "Processing..." : `Pay $${depositAmount} Deposit`}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-pink-200 sticky top-4">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-200">
                    <h5 className="font-medium text-gray-700 mb-1">Customer</h5>
                    <p className="text-sm text-gray-600">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  {selectedServiceData ? (
                    <>
                      <div>
                        <h4 className="font-semibold text-gray-800">{selectedServiceData.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {selectedServiceData.duration}
                        </div>
                      </div>

                      {selectedDate && (
                        <div className="border-t pt-4">
                          <h5 className="font-medium text-gray-700 mb-1">Appointment Details</h5>
                          <p className="text-sm text-gray-600">{formatSelectedDate(selectedDate)}</p>
                          {selectedTime && <p className="text-sm text-gray-600">at {selectedTime}</p>}
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm">
                          <span>Service Total:</span>
                          <span>${selectedServiceData.price}</span>
                        </div>
                        <div className="flex justify-between text-sm text-pink-600 font-semibold">
                          <span>Deposit Required:</span>
                          <span>${depositAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Due at Appointment:</span>
                          <span>${selectedServiceData.price - depositAmount}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center">Select a service to see pricing</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
