import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, UserPlus } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 polka-dot-bg">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          {/* Decorative bow */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-16 relative">
              <svg viewBox="0 0 100 60" className="w-full h-full fill-pink-400">
                <path d="M20 30 Q30 10 50 30 Q70 10 80 30 Q70 50 50 30 Q30 50 20 30 Z" />
                <circle cx="50" cy="30" r="8" className="fill-pink-500" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Beautiful Hair,
            <span className="text-pink-600"> Beautiful You</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional braiding services with love and care. Create your account to book appointments, manage your
            schedule, and enjoy personalized service.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-3">
            <Link href="/auth">
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account & Book
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-pink-500 text-pink-600 hover:bg-pink-50 text-lg px-8 py-3 bg-transparent"
          >
            <Link href="#services">View Services & Pricing</Link>
          </Button>
        </div>

        <div className="bg-pink-50 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <p className="text-pink-700 font-medium">✨ Account Required for Booking</p>
          <p className="text-pink-600 text-sm mt-1">
            Create your account to book appointments, track your visits, and manage your beauty journey with us!
          </p>
        </div>

        <div className="flex justify-center items-center gap-2 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-current" />
          ))}
          <span className="ml-2 text-gray-600 font-medium">5.0 • Trusted by 200+ clients</span>
        </div>
      </div>
    </section>
  )
}
