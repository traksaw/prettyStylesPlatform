import Link from "next/link"
import { MessageCircle, Phone, Mail } from "lucide-react"

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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
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
