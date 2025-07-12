"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CreditCard, Shield } from "lucide-react"

interface SquareBookingWidgetProps {
  squareBookingUrl?: string
}

export default function SquareBookingWidget({
  squareBookingUrl = "https://squareup.com/appointments/book/your-square-site-id",
}: SquareBookingWidgetProps) {
  return (
    <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
      <CardHeader className="bg-pink-100">
        <CardTitle className="text-pink-700 text-center">Ready to Book?</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-700">Book your appointment securely through our Square booking system</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-pink-500 mr-2" />
              Real-time availability
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 text-pink-500 mr-2" />
              Secure payments
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-pink-500 mr-2" />
              Instant confirmation
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-pink-500 mr-2" />
              Protected booking
            </div>
          </div>

          <Button asChild size="lg" className="w-full bg-pink-500 hover:bg-pink-600 text-lg py-6">
            <a href={squareBookingUrl} target="_blank" rel="noopener noreferrer">
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Appointment
            </a>
          </Button>

          <p className="text-xs text-gray-500">Powered by Square • No account required</p>
        </div>
      </CardContent>
    </Card>
  )
}
