"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Calendar, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              PrettyStyles
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-gray-700 hover:text-pink-600 transition-colors">
              Services
            </Link>
            <Link href="#policies" className="text-gray-700 hover:text-pink-600 transition-colors">
              Policies
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">
              Contact
            </Link>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link href="/booking">
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Link>
            </Button>

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                          <AvatarFallback className="bg-pink-100 text-pink-600">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account">
                          <User className="mr-2 h-4 w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    asChild
                    className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                  >
                    <Link href="/auth">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-pink-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="#services" className="text-gray-700 hover:text-pink-600 transition-colors">
                Services
              </Link>
              <Link href="#policies" className="text-gray-700 hover:text-pink-600 transition-colors">
                Policies
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">
                Contact
              </Link>
              <Button asChild className="bg-pink-500 hover:bg-pink-600 w-full">
                <Link href="/booking">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Link>
              </Button>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Button variant="outline" asChild className="w-full bg-transparent">
                        <Link href="/account">
                          <User className="w-4 h-4 mr-2" />
                          My Account
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={handleSignOut} className="w-full bg-transparent">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      asChild
                      className="border-pink-500 text-pink-600 hover:bg-pink-50 w-full bg-transparent"
                    >
                      <Link href="/auth">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
