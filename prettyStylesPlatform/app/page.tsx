import Header from "./components/Header"
import Hero from "./components/Hero"
import Services from "./components/Services"
import ReviewsSection from "./components/ReviewsSection"
import BookingPolicies from "./components/BookingPolicies"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <ReviewsSection />
      <BookingPolicies />
      <Contact />
      <Footer />
    </div>
  )
}
