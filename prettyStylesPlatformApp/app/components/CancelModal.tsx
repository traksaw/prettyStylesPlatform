"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, X } from "lucide-react"

interface CancelModalProps {
  booking: any
  onCancel: (bookingId: string, reason?: string) => Promise<void>
  children: React.ReactNode
}

export default function CancelModal({ booking, onCancel, children }: CancelModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    setError("")

    try {
      await onCancel(booking.id, reason)
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setReason("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel appointment")
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setReason("")
    setError("")
    setSuccess(false)
  }

  // Calculate if cancellation is within 24 hours
  const appointmentDate = new Date(booking.date)
  const now = new Date()
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  const isWithin24Hours = hoursUntilAppointment < 24 && hoursUntilAppointment > 0
  const depositRefundable = !isWithin24Hours

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetModal()
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-700">
            <X className="w-5 h-5 mr-2" />
            Cancel Appointment
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Appointment Cancelled</h3>
            <p className="text-green-700">Your appointment has been successfully cancelled.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Appointment Details</h4>
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
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Alert className={`${isWithin24Hours ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
              <AlertTriangle className={`h-4 w-4 ${isWithin24Hours ? "text-red-600" : "text-green-600"}`} />
              <AlertDescription className={isWithin24Hours ? "text-red-700" : "text-green-700"}>
                {depositRefundable ? (
                  <>
                    <strong>Good news!</strong> Since you're cancelling more than 24 hours in advance, your $
                    {booking.depositPaid} deposit will be refunded within 3-5 business days.
                  </>
                ) : (
                  <>
                    <strong>Cancellation Policy:</strong> Cancellations within 24 hours forfeit the $
                    {booking.depositPaid} deposit as per our booking policy.
                  </>
                )}
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Let us know why you're cancelling so we can improve our service..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isLoading}>
                Keep Appointment
              </Button>
              <Button onClick={handleCancel} variant="destructive" className="flex-1" disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                {isLoading ? "Cancelling..." : "Cancel Appointment"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
