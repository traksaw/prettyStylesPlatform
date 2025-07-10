import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"

const services = [
  {
    category: "Knotless Braids",
    description: "Protective styling that's gentle on your edges",
    styles: [
      { name: "Jumbo", duration: "1.5 Hrs", price: 80 },
      { name: "Large", duration: "2.5 Hrs", price: 95 },
      { name: "Medium", duration: "4 Hrs", price: 130 },
      { name: "Small", duration: "5.5 Hrs", price: 160 },
      { name: "XSmall", duration: "6-7 Hrs", price: 200 },
    ],
  },
  {
    category: "Half Stitch/Half Knotless",
    description: "Best of both worlds - durability meets comfort",
    styles: [
      { name: "Medium", duration: "2 Hrs", price: 135 },
      { name: "Small", duration: "3.5 Hrs", price: 155 },
      { name: "XSmall", duration: "4.5 Hrs", price: 175 },
    ],
  },
  {
    category: "Stitch Braids",
    description: "Classic straight-back braids for a sleek look",
    styles: [
      { name: "(2) Braids", duration: "30 min", price: 30 },
      { name: "(4) Braids", duration: "1 Hr", price: 45 },
      { name: "(6) Braids", duration: "1.5 Hr", price: 55 },
      { name: "(8) Braids", duration: "4 Hr", price: 65 },
    ],
  },
]

const addOns = [
  { name: "Boho Curls", price: 40 },
  { name: "Extension on Stitch Braids", price: 20 },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-pink-600 brand-title mb-4 tracking-wide">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 section-title">
            Professional Braiding &
            <span className="text-pink-600 brand-script block text-4xl md:text-5xl mt-2">Pricing</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Professional braiding services with hair included. All prices include premium quality hair extensions.
          </p>
          <Badge variant="secondary" className="mt-6 bg-pink-100 text-pink-700 px-4 py-2 text-sm font-medium">
            Hair included on all services (colors 1, 1B, 2 & 4)
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700 text-xl font-semibold">{service.category}</CardTitle>
                <p className="text-sm text-gray-600 font-light">{service.description}</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {service.styles.map((style, styleIndex) => (
                    <div
                      key={styleIndex}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-medium text-gray-800">{style.name}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1 font-light">
                          <Clock className="w-4 h-4 mr-1" />
                          {style.duration}
                        </div>
                      </div>
                      <div className="flex items-center text-pink-600 font-semibold text-lg">
                        <DollarSign className="w-4 h-4" />
                        {style.price}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-pink-200 bg-pink-50/50">
          <CardHeader>
            <CardTitle className="text-pink-700 text-xl font-semibold">Add-Ons</CardTitle>
            <p className="text-sm text-gray-600 font-light">Enhance your style with these optional extras</p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {addOns.map((addon, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-800">{addon.name}</span>
                  <span className="flex items-center text-pink-600 font-semibold text-lg">
                    <DollarSign className="w-4 h-4" />
                    {addon.price}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic font-light">
            *Prices may change depending on hair length and complexity
          </p>
        </div>
      </div>
    </section>
  )
}
