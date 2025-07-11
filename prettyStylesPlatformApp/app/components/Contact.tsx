"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Mail, MapPin, Clock, MessageCircle, Camera, X, Upload, CheckCircle, AlertCircle } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxFiles = 5
    const maxSize = 5 * 1024 * 1024 // 5MB per file

    // Filter valid files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload only image files")
        return false
      }
      if (file.size > maxSize) {
        setError("Each image must be less than 5MB")
        return false
      }
      return true
    })

    // Check total file count
    if (photos.length + validFiles.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} photos`)
      return
    }

    // Add new files
    const newPhotos = [...photos, ...validFiles]
    setPhotos(newPhotos)

    // Create previews
    const newPreviews = [...photoPreviews]
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        setPhotoPreviews([...newPreviews])
      }
      reader.readAsDataURL(file)
    })

    setError("")
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Simulate form submission with photos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would:
      // 1. Upload photos to cloud storage (AWS S3, Cloudinary, etc.)
      // 2. Send form data with photo URLs to your backend
      // 3. Send email notification with attachments

      console.log("Form submitted:", {
        ...formData,
        photoCount: photos.length,
        photos: photos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      })

      setSubmitStatus("success")

      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        })
        setPhotos([])
        setPhotoPreviews([])
        setSubmitStatus("idle")
      }, 3000)
    } catch (err) {
      setError("Failed to send message. Please try again.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600">Ready to book or have questions? We'd love to hear from you!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Card className="border-pink-200 mb-8">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-pink-500 mr-3" />
                    <span className="text-gray-700">(215) 558-0399</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-pink-500 mr-3" />
                    <span className="text-gray-700">prettyystyyles@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-pink-500 mr-3" />
                    <span className="text-gray-700">
                      4723 Rorer Street *Home Based*
                      <br />
                      Philadelphia, PA 19120
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-pink-500 mr-3" />
                    <span className="text-gray-700">Mon-Sat: 9AM-7PM, Sun: Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700">Follow Us</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-pink-500 text-pink-600 hover:bg-pink-50 bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-pink-200">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {submitStatus === "success" ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">Thank you for contacting us. We'll get back to you soon!</p>
                </div>
              ) : (
                <>
                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Your first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Your last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Interested In
                      </label>
                      <Input
                        id="service"
                        name="service"
                        placeholder="e.g., Medium Knotless Braids"
                        value={formData.service}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your desired style, any questions, or special requests..."
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Photo Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos (Optional)</label>
                      <p className="text-xs text-gray-500 mb-3">
                        Share reference images or photos of your hair. Max 5 photos, 5MB each.
                      </p>

                      {/* Upload Button */}
                      <div className="mb-4">
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center hover:border-pink-400 hover:bg-pink-50 transition-colors">
                            <Upload className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                            <p className="text-sm text-pink-600 font-medium">Click to upload photos</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                          </div>
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Photo Previews */}
                      {photoPreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {photoPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview || "/placeholder.svg"}
                                alt={`Upload preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-pink-200"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                {Math.round(photos[index]?.size / 1024)}KB
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Send Message {photos.length > 0 && `(${photos.length} photo${photos.length > 1 ? "s" : ""})`}
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
