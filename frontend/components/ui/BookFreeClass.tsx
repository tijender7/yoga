'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactConfetti from 'react-confetti'
import { useEffect, useRef } from 'react'
import { toast, Toaster } from 'sonner'


type NotificationType = 'success' | 'error' | null;

interface Notification {
  type: NotificationType;
  message: string;
}

const countryCodes = [
  { code: '+1', country: 'US/CAN' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IND' },
  { code: '+49', country: 'GER' },
  // Add more country codes as needed
]

export default function BookFreeClass({ buttonText = "Book Your Free Class" }: { buttonText?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [notification, setNotification] = useState<Notification | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isConfettiActive, setIsConfettiActive] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNotification(null)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!name.trim()) {
      setNotification({ type: 'error', message: "Please provide your name." })
      return
    }
    if (!email || !emailRegex.test(email)) {
      setNotification({ type: 'error', message: "Please provide a valid email address." })
      return
    }
    console.log('Submitted:', { name, email, phone: phone ? `${countryCode}${phone}` : 'Not provided' })
    setIsDialogOpen(false)
    showConfirmation()
  }

  const showConfirmation = () => {
    setIsConfettiActive(true)
    toast.success("You're all set for Weekend's class! We've sent the class link to your email. Can't wait to see you there!", {
      duration: 5000,
      position: 'bottom-right',
      className: 'custom-toast',
    })
    setTimeout(() => {
      setIsConfettiActive(false)
      setNotification(null)
    }, 3000)
  }

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const confettiRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Toaster />
      {isConfettiActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      <div className="relative">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {buttonText}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white text-gray-800 rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Book Your Free Weekend Class</DialogTitle>
              <DialogDescription className="text-gray-600">
                Enter your details below to secure your spot in our upcoming free yoga session.
              </DialogDescription>
            </DialogHeader>
            {notification && (
              <div className={`p-2 rounded-md ${
                notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              } text-sm mb-4`}>
                {notification.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name*
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone (optional)
                </Label>
                <div className="flex space-x-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[130px] bg-gray-100 border-gray-300">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.code} ({country.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                We respect your privacy. Your email is required to send you the Zoom link for the class. 
                Phone number is optional. We are GDPR compliant and adhere to international data protection regulations.
              </p>
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 transition-colors">
                Book Now
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}