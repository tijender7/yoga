import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface PricingPlan {
  id: number
  region: string
  currency: string
  discounted_price: string
  discount_percentage: number
  strike_through_price: string
  savings: string
}

const pricingPlans = [
  {
    region: "India",
    price: 3500,
    originalPrice: 5833,
    currency: "₹",
  },
  {
    region: "US",
    price: 40,
    originalPrice: 67,
    currency: "$",
  },
  {
    region: "Europe",
    price: 40,
    originalPrice: 67,
    currency: "€",
  },
]

export default function PricingSection() {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])

  useEffect(() => {
    async function fetchPricingPlans() {
      const { data, error } = await supabase
        .from('monthly_pricing_fixed')
        .select('*')

      if (error) {
        console.error('Error fetching pricing plans:', error)
      } else {
        setPricingPlans(data)
      }
    }

    fetchPricingPlans()
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">
          Simple and Affordable Plans
        </h2>
        <div className="text-center mb-8">
          <span className="inline-block bg-red-500 text-white text-lg font-semibold px-4 py-2 rounded-full animate-pulse shadow-lg shadow-red-500/50">
            Limited Time Offer: {pricingPlans[0]?.discount_percentage}% OFF!
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">{plan.region}</CardTitle>
                <p className="text-sm text-gray-600">Monthly payment</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="mb-4">
                  <p className="text-4xl font-bold mb-2 text-gray-800">
                    {plan.currency}{plan.discounted_price}
                    <span className="text-lg font-normal">/month</span>
                  </p>
                  <p className="text-lg text-gray-500 line-through">
                    {plan.currency}{plan.strike_through_price}/month
                  </p>
                  <p className="text-sm text-green-600 font-semibold">
                    Save {plan.currency}{plan.savings}!
                  </p>
                </div>
                <ul className="space-y-2 mb-4 flex-grow">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">All Inclusive</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">5 days a week, 1 hour sessions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Zoom sessions with privacy</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Hardcore stretching</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Flexibility training</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl font-bold text-gray-800 bg-yellow-200 inline-block px-4 py-2 rounded-lg shadow-md mb-4">
            Choose Your Session Type:
          </p>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Private Mode:</span> Join group classes privately—others won't see you.
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Interactive Mode:</span> Join group classes and interact with others.
            </p>
          </div>
          <p className="mt-2 text-md text-gray-600 italic font-medium">
            Same session, same price!
          </p>
        </div>
      </div>
    </section>
  )
}
