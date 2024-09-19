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
import { supabase } from '@/lib/supabase'
import { AuthError } from '@supabase/supabase-js'

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
    const username = formData.get('username') as string

    try {
      if (activeTab === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        // Only proceed with profile creation if signUp was successful
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username,
            })
          if (profileError) throw profileError
        }

        setAlert({ type: 'success', message: 'Check your email for the confirmation link.' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setAlert({ type: 'success', message: 'Successfully signed in!' })
        // Redirect to home page after successful sign in
        window.location.href = '/'
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setAlert({ type: 'error', message: error.message })
      } else {
        setAlert({ type: 'error', message: 'An unexpected error occurred' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
      if (data) {
        setAlert({ type: 'success', message: 'Google sign up initiated. Redirecting...' })
        // The user will be redirected to Google's OAuth page
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setAlert({ type: 'error', message: error.message })
      } else {
        setAlert({ type: 'error', message: 'An unexpected error occurred during Google sign-up' })
      }
    }
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
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setAlert({ type: 'success', message: 'Password reset instructions sent to your email.' })
    } catch (error) {
      setAlert({ type: 'error', message: 'Error sending reset instructions. Please try again.' })
    } finally {
      setIsLoading(false)
    }
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

  // This should be in a useEffect or similar in your main layout or app component
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // User has signed in
        setAlert({ type: 'success', message: 'Successfully signed in with Google!' })
        // Update your app state, redirect user, etc.
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

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
            <div className="space-y-2">
              <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">Username</Label>
              <Input id="signup-username" name="username" type="text" required className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" />
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
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center" onClick={handleGoogleSignUp} disabled>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/></svg>
              Sign up with Google (Coming Soon)
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
            <AlertCircle className="h-4 w-4 text-[#4285F4]" />
          )}
          <AlertTitle className="text-gray-900 font-semibold">{alert.type === 'error' ? 'Error' : alert.type === 'success' ? 'Success' : 'Info'}</AlertTitle>
          <AlertDescription className="text-gray-700">{alert.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}