"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react"

interface RescheduleModalProps {
  booking: any
  onReschedule: (bookingId: string, newDate: Date, newTime: string) => Promise<void>
  children: React.ReactNode
}

const availableTimes = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]

export default function RescheduleModal({ booking, onReschedule, children }: RescheduleModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Generate next 14 days for rescheduling (excluding today)
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

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both a date and time")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onReschedule(booking.id, selectedDate, selectedTime)
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setSelectedDate(null)
        setSelectedTime("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reschedule appointment")
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setSelectedDate(null)
    setSelectedTime("")
    setError("")
    setSuccess(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetModal()
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-pink-700">
            <Calendar className="w-5 h-5 mr-2" />
            Reschedule Appointment
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Appointment Rescheduled!</h3>
            <p className="text-green-700">Your appointment has been successfully rescheduled.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-700 mb-2">Current Appointment</h4>
              <p className="text-gray-700">{booking.service.name}</p>
              <p className="text-gray-600 text-sm">
                {new Date(booking.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at {booking.time}
              </p>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label className="text-base font-medium">Select New Date</Label>
              {selectedDate && (
                <p className="text-sm text-pink-600 font-medium mt-1">Selected: {formatSelectedDate(selectedDate)}</p>
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
                    <div className="text-xs opacity-75">{date.toLocaleDateString("en-US", { month: "short" })}</div>
                    <div className="text-xs opacity-75">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Available Times</Label>
              {selectedTime && <p className="text-sm text-pink-600 font-medium mt-1">Selected: {selectedTime}</p>}
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

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 text-sm">
                <strong>Note:</strong> Rescheduling is free up to 24 hours before your original appointment. Your
                deposit will be transferred to the new appointment.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
                disabled={isLoading || !selectedDate || !selectedTime}
              >
                <Clock className="w-4 h-4 mr-2" />
                {isLoading ? "Rescheduling..." : "Reschedule Appointment"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
