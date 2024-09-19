'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, Check, Loader2 } from 'lucide-react'

export default function AdvancedAuthTabs() {
  const [activeTab, setActiveTab] = useState('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
    if (password.match(/\d/)) strength += 25
    if (password.match(/[^a-zA-Z\d]/)) strength += 25
    setPasswordStrength(strength)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password) {
      setAlert({ type: 'error', message: 'Please fill in all required fields.' })
      setIsLoading(false)
      return
    }

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        setAlert({ type: 'error', message: 'Passwords do not match.' })
        setIsLoading(false)
        return
      }
      if (passwordStrength < 75) {
        setAlert({ type: 'error', message: 'Please choose a stronger password.' })
        setIsLoading(false)
        return
      }
      if (!agreeToTerms) {
        setAlert({ type: 'error', message: 'Please agree to the Terms of Service.' })
        setIsLoading(false)
        return
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setAlert({ type: 'success', message: `${activeTab === 'signup' ? 'Sign up' : 'Sign in'} successful!` })
    setIsLoading(false)
  }

  const handleGoogleSignUp = () => {
    setAlert({ type: 'info', message: 'Google sign up initiated. Redirecting...' })
    // Implement actual Google sign up logic here
  }

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value
    if (!email) {
      setAlert({ type: 'error', message: 'Please enter your email address.' })
      setIsLoading(false)
      return
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAlert({ type: 'success', message: 'Password reset instructions sent to your email.' })
    setIsLoading(false)
  }

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    const confirmPassword = (event.currentTarget.elements.namedItem('confirmPassword') as HTMLInputElement).value
    if (!password || !confirmPassword) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' })
      setIsLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match.' })
      setIsLoading(false)
      return
    }
    if (passwordStrength < 75) {
      setAlert({ type: 'error', message: 'Please choose a stronger password.' })
      setIsLoading(false)
      return
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAlert({ type: 'success', message: 'Password reset successful. You can now sign in with your new password.' })
    setIsLoading(false)
    setActiveTab('signin')
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent">
          <TabsTrigger 
            value="signup" 
            className="text-lg font-medium py-2 text-gray-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all bg-transparent hover:bg-transparent focus:bg-transparent"
          >
            Sign Up
          </TabsTrigger>
          <TabsTrigger 
            value="signin" 
            className="text-lg font-medium py-2 text-gray-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all bg-transparent hover:bg-transparent focus:bg-transparent"
          >
            Sign In
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input id="signup-email" name="email" type="email" required className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={(e) => calculatePasswordStrength(e.target.value)}
                  className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <Progress value={passwordStrength} className="w-full h-2" />
              <p className="text-sm text-gray-600 mt-1">
                Password strength: <span className={`font-medium ${passwordStrength < 25 ? 'text-red-500' : passwordStrength < 50 ? 'text-yellow-500' : passwordStrength < 75 ? 'text-blue-500' : 'text-green-500'}`}>
                  {passwordStrength < 25 ? 'Weak' : passwordStrength < 50 ? 'Fair' : passwordStrength < 75 ? 'Good' : 'Strong'}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <Input id="signup-confirm-password" name="confirmPassword" type="password" required className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)} />
              <label
                htmlFor="terms"
                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>
              </label>
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center" onClick={handleGoogleSignUp}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/></svg>
              Sign up with Google
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="signin">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input id="signin-email" name="email" type="email" required className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <Button variant="link" className="mt-2 w-full text-primary hover:underline" onClick={() => setActiveTab('forgot-password')}>
            Forgot Password?
          </Button>
        </TabsContent>
        <TabsContent value="forgot-password">
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-password-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input id="forgot-password-email" name="email" type="email" required className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" />
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
          <Button variant="outline" className="mt-4 w-full text-primary hover:bg-gray-50 border-gray-300" onClick={() => setActiveTab('signin')}>
            Back to Sign In
          </Button>
        </TabsContent>
      </Tabs>
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mt-4">
          {alert.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : alert.type === 'success' ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-black" />
          )}
          <AlertTitle className="text-gray-900 font-semibold">{alert.type === 'error' ? 'Error' : alert.type === 'success' ? 'Success' : 'Info'}</AlertTitle>
          <AlertDescription className="text-gray-700">{alert.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}