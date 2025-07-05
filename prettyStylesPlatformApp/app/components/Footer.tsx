import Link from "next/link"
import { Instagram, MessageCircle, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-pink-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">PrettyStyles</h3>
            <p className="text-pink-200 mb-4">
              Professional braiding services with love and care. Creating beautiful styles that make you feel confident
              and radiant.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#services" className="text-pink-200 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#policies" className="text-pink-200 hover:text-white transition-colors">
                  Policies
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-pink-200 hover:text-white transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-pink-200 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-pink-200">
              <li>(555) 123-4567</li>
              <li>hello@prettystyles.com</li>
              <li>
                123 Beauty Lane
                <br />
                Style City, SC 12345
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-800 mt-8 pt-8 text-center text-pink-200">
          <p>&copy; 2024 PrettyStyles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
