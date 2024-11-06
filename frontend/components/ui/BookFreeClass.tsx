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
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

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

export default function BookFreeClass({ buttonText = "Book Your Free Class", isOpen, onOpenChange, buttonClassName }: { buttonText?: string, isOpen?: boolean, onOpenChange?: (isOpen: boolean) => void, buttonClassName?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsDialogOpen(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isDialogOpen);
    }
  }, [isDialogOpen, onOpenChange]);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [notification, setNotification] = useState<Notification | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isConfettiActive, setIsConfettiActive] = useState(false)
  const [healthConditions, setHealthConditions] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotification(null)
    setIsLoading(true)
    
    try {
      // Basic validation
      if (!name.trim() || !email.trim()) {
        throw new Error("Please fill in all required fields.")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.")
      }

      // Check if email already exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Error checking email: ${checkError.message}`)
      }

      if (existingUser) {
        throw new Error("You have already booked a free class. Please check your email for details.")
      }

      // Create a new user account with email confirmation
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: {
            full_name: name,
            phone,
            healthConditions
          },
          emailRedirectTo: `${window.location.origin}/reset-password`
        }
      })

      if (signUpError) {
        throw new Error(`Error creating user: ${signUpError.message}`)
      }

      if (!newUser || !newUser.user) {
        throw new Error('User data not received after signup')
      }

      // Call backend API to create user
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: newUser.user.id,
          email: email,
          name: name,
          phone: phone ? `${countryCode}${phone}` : null,
          healthConditions: healthConditions || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user in backend')
      }

      setNotification({ 
        type: 'success', 
        message: "Your account has been created. Please check your email to set your password and access your free class details." 
      })
      setIsDialogOpen(false)
      showConfirmation()

    } catch (error: unknown) {
      console.error('Error in handleSubmit:', error)
      if (error instanceof Error) {
        setNotification({ type: 'error', message: error.message || "An unexpected error occurred. Please try again." })
      } else {
        setNotification({ type: 'error', message: "An unexpected error occurred. Please try again." })
      }
    } finally {
      setIsLoading(false)
    }
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
            <Button className={buttonClassName || "bg-primary text-primary-foreground hover:bg-primary/90"}>
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
              <div className="space-y-2">
                <Label htmlFor="health-conditions" className="text-sm font-medium text-gray-700">
                  Health Conditions/Medical Issues
                </Label>
                <Input
                  id="health-conditions"
                  value={healthConditions}
                  onChange={(e) => setHealthConditions(e.target.value)}
                  className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="E.g., back pain, knee issues, pregnancy, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional-info" className="text-sm font-medium text-gray-700">
                  Any other information you'd like us to know
                </Label>
                <Input
                  id="additional-info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="E.g., specific goals, concerns, or preferences"
                />
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

function GlowButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <BookFreeClass 
        buttonText="Free Trial"
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        buttonClassName={`
          bg-primary text-primary-foreground hover:bg-primary/90
          transition-all duration-200 ease-out
          px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
          ${isHovered ? 'shadow-lg' : 'shadow'}
        `}
      />
      {isHovered && (
        <div className="absolute inset-0 -z-10 bg-primary/20 blur-xl rounded-full transition-opacity duration-200 ease-out opacity-75" />
      )}
    </div>
  )
}
