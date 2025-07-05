import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock, CreditCard, Calendar } from "lucide-react"

export default function BookingPolicies() {
  return (
    <section id="policies" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Booking Policies</h2>
          <p className="text-lg text-gray-600">Please read our policies carefully before booking your appointment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-pink-700">
                <CreditCard className="w-5 h-5 mr-2" />
                Deposit & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>A 50% deposit is
                  required to secure your appointment
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Remaining balance due at time of service
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We accept cash, card, and digital payments
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Deposits are non-refundable but transferable
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-pink-700">
                <Clock className="w-5 h-5 mr-2" />
                Late & Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  15-minute grace period for late arrivals
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Late arrivals may result in shortened service time
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  24-hour notice required for cancellations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Same-day cancellations forfeit deposit
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-pink-700">
                <Calendar className="w-5 h-5 mr-2" />
                Appointment Guidelines
              </CardTitle>
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
                  Consultations available for first-time clients
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="flex items-center text-pink-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                Hair Care Prep
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Wash hair 1-2 days before appointment
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Deep condition for healthier results
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Avoid heavy oils on appointment day
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Bring reference photos for desired style
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
