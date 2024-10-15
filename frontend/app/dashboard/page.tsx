"use client"

import { useState, useEffect } from "react"
import { Bell, HelpCircle, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Header from '@/components/ui/Header'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'  // Import User type

// Add this type definition at the top of your file
type Subscription = {
  id: string;
  status: string;
  razorpay_plan_id: string;
  start_date: string;
  end_date: string;
  next_payment_date: string;
  last_payment_id: string;
  order_id: string;
  invoice_id: string;
  payment_method: string;
  last_payment_date: string;
};

async function fetchSubscriptionData(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      id,
      status,
      razorpay_plan_id,
      start_date,
      end_date,
      next_payment_date,
      last_payment_id,
      order_id,
      invoice_id,
      payment_method,
      last_payment_date
    `)
    .eq('user_id', userId)
    .neq('status', 'created')
    .not('invoice_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching subscription data:', error)
    return null
  }

  return data
}

async function fetchPlanDetails(razorpayPlanId: string) {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('name, price, currency')
    .eq('razorpay_plan_id', razorpayPlanId)
    .single()

  if (error) {
    console.error('Error fetching plan details:', error)
    return null
  }

  return data
}

export default function Dashboard() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<Subscription[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const subData = await fetchSubscriptionData(user.id)
        setSubscriptionData(subData)
      } else {
        router.push('/auth')
      }
      setIsLoading(false)
    }
    checkUser()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  const handleCancelSubscription = () => {
    // In a real app, you'd implement the cancellation logic here
    console.log("Subscription cancelled")
    setShowCancelDialog(false)
  }

  const handleUpgradeSubscription = () => {
    // In a real app, you'd implement the upgrade logic here
    console.log("Navigating to upgrade options")
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.user_metadata?.full_name || "User"} />
                <AvatarFallback>{user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.user_metadata?.full_name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionData && subscriptionData.length > 0 ? (
                <>
                  <p><strong>Status:</strong> {subscriptionData[0].status}</p>
                  <p><strong>Start Date:</strong> {new Date(subscriptionData[0].start_date).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(subscriptionData[0].end_date).toLocaleDateString()}</p>
                  <p><strong>Next Payment Date:</strong> {new Date(subscriptionData[0].next_payment_date).toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> {subscriptionData[0].payment_method}</p>
                </>
              ) : (
                <p>No active subscription found. Would you like to subscribe to a plan?</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {subscriptionData ? (
                <>
                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel Subscription</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Subscription</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel your subscription? You'll lose access to premium features.
                        </DialogDescription>
                      </DialogHeader>
                      <Button onClick={handleCancelSubscription}>Confirm Cancellation</Button>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handleUpgradeSubscription}>Upgrade Subscription</Button>
                </>
              ) : (
                <Button onClick={() => router.push('/pricing')}>View Subscription Plans</Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionData && subscriptionData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Payment Date</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionData.map((subscription: Subscription, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{subscription.status}</TableCell>
                      <TableCell>
                        {subscription.last_payment_date ? (
                          <>
                            <div>{new Date(subscription.last_payment_date).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(subscription.last_payment_date).toLocaleTimeString()}
                            </div>
                          </>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{subscription.invoice_id}</TableCell>
                      <TableCell>{subscription.payment_method || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No payment history available.</p>
            )}
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" /> Contact Support
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
