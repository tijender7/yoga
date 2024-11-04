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

// Add this type for payments
type Payment = {
  id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  status: string;
  amount: number;
  currency: string;
  payment_method: string;
  created_at: string;
  email: string;
  contact: string;
};

// Add this status mapping
const paymentStatusMap: { [key: string]: string } = {
  'captured': 'Paid',
  'authorized': 'Processing',
  'failed': 'Failed',
  'refunded': 'Refunded',
  'pending': 'Pending'
};

// Function to get formatted status
const getFormattedStatus = (status: string) => {
  return paymentStatusMap[status] || status;
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

// Add this function to fetch payments
async function fetchPaymentHistory(userId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment history:', error);
    return null;
  }

  return data;
}

// Add this function to get initials
const getInitials = (name: string) => {
  if (!name) return '';
  return name.split(' ')[0][0].toUpperCase();
};

export default function Dashboard() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [subscriptionData, setSubscriptionData] = useState<Subscription[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState<Payment[] | null>(null);
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const subData = await fetchSubscriptionData(user.id)
        setSubscriptionData(subData)
        const payments = await fetchPaymentHistory(user.id)
        setPaymentHistory(payments)
      } else {
        router.push('/auth')
      }
      setIsLoading(false)
    }
    checkUser()
  }, [router])

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch user details from users table
        const { data, error } = await supabase
          .from('users')
          .select('username, email')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setUserData(data);
        }
      }
    };
    
    fetchUserData();
  }, []);

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header showNavLinks={true} />
      <main className="container py-6 flex-grow flex flex-col">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {userData?.username ? getInitials(userData.username) : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle>{userData?.username || 'User'}</CardTitle>
                <CardDescription>{userData?.email}</CardDescription>
              </div>
            </CardHeader>
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
            {paymentHistory && paymentHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment: Payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.razorpay_order_id}</TableCell>
                      <TableCell>
                        ₹{payment.amount} {payment.currency}
                      </TableCell>
                      <TableCell>
                        <div>{new Date(payment.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.payment_method}
                      </TableCell>
                      <TableCell>
                        <div className={`
                          ${payment.status === 'captured' ? 'text-green-600' : ''}
                          ${payment.status === 'failed' ? 'text-red-600' : ''}
                          ${payment.status === 'pending' ? 'text-yellow-600' : ''}
                        `}>
                          {getFormattedStatus(payment.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No payment history available.</p>
            )}
          </CardContent>
        </Card>
        <Card className="mt-auto mb-4">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => window.location.href = '/contact'}
            >
              <HelpCircle className="mr-2 h-4 w-4" /> 
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
