'use client'

import React, { useState, useEffect, useRef } from 'react'
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
import { useRouter } from 'next/navigation'

export default function AdvancedAuthTabs({ defaultTab = 'signin' }) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [signInPassword, setSignInPassword] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true)
  
  // Separate timer refs for alert and redirection
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null)
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  // Add this useEffect to handle tab changes
  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  // Add this function to handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/auth?tab=${value}`, { scroll: false })
  }

  // Handler for Sign-Up Password Change
  const handleSignUpPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setSignUpPassword(newPassword)
    const newStrength = calculatePasswordStrength(newPassword)
    setPasswordStrength(newStrength)
    setIsPasswordEmpty(newPassword.length === 0)
  }

  // Handler for Sign-In Password Change
  const handleSignInPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setSignInPassword(newPassword)
    setIsPasswordEmpty(newPassword.length === 0)
    // Password strength not needed for sign-in
  }

  // Effect to Clear Alert Timer After 5 Seconds
  useEffect(() => {
    if (alert) {
      alertTimerRef.current = setTimeout(() => setAlert(null), 5000)
      return () => {
        if (alertTimerRef.current) clearTimeout(alertTimerRef.current)
      }
    }
  }, [alert])

  // Password Strength Calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0

    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/\d/)) strength += 25

    return strength
  }

  // Submit Handler for Sign-In and Sign-Up
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormErrors({}) // Reset errors

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = activeTab === 'signin' ? signInPassword : signUpPassword

    // Initialize variables for signup
    let confirmPassword = ''
    let username = ''

    if (activeTab === 'signup') {
      confirmPassword = signUpConfirmPassword
      username = formData.get('username') as string
    }

    let newErrors: { [key: string]: string } = {}

    // 1. Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // 2. Password Validation (Only for Sign-Up)
    if (activeTab === 'signup') {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long'
      } else if (passwordStrength < 75) {
        newErrors.password = 'Password is not strong enough. Use uppercase, lowercase, and numbers'
      }
    }

    // 3. Additional Validations for Sign-Up
    if (activeTab === 'signup') {
      // a. Confirm Password
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      // b. Username Validation
      if (!username || username.length < 3 || username.length > 20) {
        newErrors.username = 'Username must be between 3 and 20 characters'
      }

      // c. Terms Agreement
      if (!agreeToTerms) {
        newErrors.terms = 'You must agree to the terms and conditions'
      }
    }

    // 4. If There Are Validation Errors, Set Them and Halt Submission
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)

      // Shift focus to the first error field for accessibility
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(`signup-${firstErrorField}`) || document.getElementById(`signin-${firstErrorField}`)
      if (element) {
        element.focus()
      }

      setIsLoading(false)
      return
    }

    try {
      if (activeTab === 'signup') {
        // Step 1: Check if Username is Unique
        const { data: existingUsername, error: usernameError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .maybeSingle()

        if (usernameError && usernameError.code !== 'PGRST116') {
          throw usernameError
        }

        if (existingUsername) {
          setFormErrors({ username: 'Username is already taken.' })
          setIsLoading(false)
          return
        }

        // Step 2: Call backend signup endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name: username,
            username
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to create user');
        }

        setAlert({
          type: 'success',
          message: 'Signup successful! Please check your email to verify your account.'
        });

        // Redirect to auth page with signin tab after 2 seconds
        redirectTimerRef.current = setTimeout(() => {
          router.push('/auth?tab=signin');
        }, 2000);
      } else if (activeTab === 'signin') {
        // Sign-In Logic
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        if (!data.session || !data.session.user) {
          throw new Error('User session not found after signin')
        }

        const user = data.session.user

        if (!user.email_confirmed_at) {
          // Email is not verified
          // Sign the user out
          const { error: signOutError } = await supabase.auth.signOut()
          if (signOutError) {
            console.error('Error signing out:', signOutError)
          }

          // Inform the user to verify their email
          setAlert({
            type: 'error',
            message: 'Please verify your email before signing in. A verification link has been sent to your email.',
          })

          // Optionally, resend the verification email
          const { error: resendError } = await supabase.auth.updateUser({
            email: user.email,
          })

          if (resendError) {
            console.error('Error resending verification email:', resendError)
            setAlert({
              type: 'error',
              message: 'Failed to resend verification email. Please contact support.',
            })
          } else {
            setAlert({
              type: 'info',
              message: 'A verification link has been resent to your email.',
            })
          }

          setIsLoading(false)
          return
        }

        // If email is verified, proceed with sign-in
        setAlert({ 
          type: 'success', 
          message: 'Successfully signed in! Redirecting to dashboard...' 
        })
        
        // Use router.push instead of window.location
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Signup/Signin process failed:', error)

      if (activeTab === 'signup') {
        // Handle Specific Sign-Up Errors
        if (error instanceof AuthError) {
          switch (error.message) {
            case 'User already registered':
              setFormErrors({ email: 'An account with this email already exists.' })
              break
            default:
              setAlert({
                type: 'error',
                message: error.message || 'An unexpected error occurred during signup.'
              })
          }
        } else {
          setAlert({
            type: 'error',
            message: error.message || 'An unexpected error occurred during signup.'
          })
        }
      } else if (activeTab === 'signin') {
        // Handle Specific Sign-In Errors
        if (error instanceof AuthError) {
          switch (error.message) {
            case 'Invalid login credentials':
              setAlert({
                type: 'error',
                message: 'Invalid email or password.'
              })
              break
            default:
              setAlert({
                type: 'error',
                message: error.message || 'An unexpected error occurred during signin.'
              })
          }
        } else {
          setAlert({
            type: 'error',
            message: error.message || 'An unexpected error occurred during signin.'
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Google Sign-Up Handler (Point 6 Skipped)
  const handleGoogleSignUp = async () => {
    // Implementation Pending
  }

  // Forgot Password Handler (Point 10 Implemented)
  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setFormErrors({}) // Reset errors

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormErrors({ email: 'Please enter a valid email address' })
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password', // Customize the redirect URL as needed
      })

      if (error) throw error

      setAlert({ type: 'success', message: 'Password reset email sent! Please check your inbox.' })
    } catch (error: any) {
      console.error('Password reset failed:', error)
      setAlert({
        type: 'error',
        message: 'Password reset failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset Password Handler (Point 10 Skipped)
  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    // Implementation Pending
  }

  // Authentication State Listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setAlert({ type: 'success', message: 'Successfully signed in with Google!' })
        // Update your app state, redirect user, etc.
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Cleanup Timers on Component Unmount
  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current)
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent">
          <TabsTrigger 
            value="signin" 
            className="text-lg font-medium py-2 text-gray-600 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all bg-transparent hover:bg-transparent focus:bg-transparent"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            className="text-lg font-medium py-2 text-gray-600 data-[state=active]:text-white data-[state=active]:bg-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all bg-transparent hover:bg-transparent focus:bg-transparent"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        {/* Sign In Tab */}
        <TabsContent value="signin">
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign In Form">
            <div className="space-y-2 relative">
              <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input 
                id="signin-email" 
                name="email" 
                type="email" 
                required 
                className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" 
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'signin-email-error' : undefined}
              />
              {formErrors.email && (
                <p id="signin-email-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                  value={signInPassword}
                  onChange={handleSignInPasswordChange}
                  aria-invalid={!!formErrors.password}
                  aria-describedby={formErrors.password ? 'signin-password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {formErrors.password && (
                <p id="signin-password-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.password}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                aria-label="Remember me"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary-dark font-medium" 
              disabled={isLoading}
              aria-busy={isLoading}
            >
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
          <Button 
            variant="link" 
            className="mt-2 w-full text-primary hover:underline" 
            onClick={() => setActiveTab('forgot-password')}
            aria-label="Forgot Password"
          >
            Forgot Password?
          </Button>
        </TabsContent>
        {/* Sign Up Tab */}
        <TabsContent value="signup">
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign Up Form">
            <div className="space-y-2 relative">
              <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                required
                className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                autoComplete="off"
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'signup-email-error' : undefined}
              />
              {formErrors.email && (
                <p id="signup-email-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                  value={signUpPassword}
                  onChange={handleSignUpPasswordChange}
                  aria-invalid={!!formErrors.password}
                  aria-describedby={formErrors.password ? 'signup-password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {formErrors.password && (
                <p id="signup-password-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.password}
                </p>
              )}
            </div>
            {/* Password Strength Meter */}
            {!isPasswordEmpty && activeTab === 'signup' && (
              <div className="relative">
                <Progress value={passwordStrength} className="w-full h-2" aria-label="Password Strength" />
                <p className="text-sm text-gray-600 mt-1">
                  Password strength: <span className={`font-medium ${passwordStrength < 25 ? 'text-red-500' : passwordStrength < 50 ? 'text-yellow-500' : passwordStrength < 75 ? 'text-blue-500' : 'text-green-500'}`}>
                    {passwordStrength < 25 ? 'Weak' : passwordStrength < 50 ? 'Fair' : passwordStrength < 75 ? 'Good' : 'Strong'}
                  </span>
                </p>
              </div>
            )}
            <div className="space-y-2 relative">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  aria-invalid={!!formErrors.confirmPassword}
                  aria-describedby={formErrors.confirmPassword ? 'signup-confirmPassword-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {formErrors.confirmPassword && (
                <p id="signup-confirmPassword-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">Username</Label>
              <Input 
                id="signup-username" 
                name="username" 
                type="text" 
                required 
                className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" 
                aria-invalid={!!formErrors.username}
                aria-describedby={formErrors.username ? 'signup-username-error' : undefined}
              />
              {formErrors.username && (
                <p id="signup-username-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.username}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 relative">
              <Checkbox 
                id="terms" 
                checked={agreeToTerms} 
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)} 
                aria-invalid={!!formErrors.terms}
                aria-describedby={formErrors.terms ? 'signup-terms-error' : undefined}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>
              </label>
              {formErrors.terms && (
                <p id="signup-terms-error" className="text-red-500 text-xs absolute -bottom-5 left-0">
                  {formErrors.terms}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary-dark font-medium" 
              disabled={isLoading}
              aria-busy={isLoading}
            >
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
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center" 
              onClick={handleGoogleSignUp} 
              disabled
              aria-disabled="true"
              aria-label="Sign up with Google (Coming Soon)"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
              </svg>
              Sign up with Google (Coming Soon)
            </Button>
          </div>
        </TabsContent>
        {/* Forgot Password Tab */}
        <TabsContent value="forgot-password">
          <form onSubmit={handleForgotPassword} className="space-y-4" aria-label="Forgot Password Form">
            <div className="space-y-2 relative">
              <Label htmlFor="forgot-password-email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input 
                id="forgot-password-email" 
                name="email" 
                type="email" 
                required 
                className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary text-gray-900" 
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'forgot-password-email-error' : undefined}
              />
              {formErrors.email && (
                <p id="forgot-password-email-error" className="text-red-500 text-xs absolute -bottom-5">
                  {formErrors.email}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary-dark font-medium" 
              disabled={isLoading}
              aria-busy={isLoading}
            >
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
          <Button 
            variant="outline" 
            className="mt-4 w-full text-primary hover:bg-gray-50 border-gray-300" 
            onClick={() => setActiveTab('signin')}
            aria-label="Back to Sign In"
          >
            Back to Sign In
          </Button>
        </TabsContent>
      </Tabs>
      {alert && (
        <Alert 
          variant={alert.type === 'error' ? 'destructive' : 'default'} 
          className="mt-4" 
          role="alert"
        >
          {alert.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : alert.type === 'success' ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-[#4285F4]" />
          )}
          <AlertTitle className="text-gray-900 font-semibold">
            {alert.type === 'error' ? 'Error' : alert.type === 'success' ? 'Success' : 'Info'}
          </AlertTitle>
          <AlertDescription className="text-gray-700">{alert.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
