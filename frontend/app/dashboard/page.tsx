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
import ContactFormModal from './form'

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

// Improved getInitials function with proper type checking
const getInitials = (name: string | undefined | null): string => {
  if (!name) return '?';
  return name.split(' ')[0].charAt(0).toUpperCase();
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
        {/* Profile Card with improved UI */}
        <Card className="w-full mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/10">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/5 text-lg">
                  {getInitials(userData?.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-2xl">{userData?.username || 'User'}</CardTitle>
                <CardDescription className="text-base">{userData?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Payment History Card with improved styling */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Payment History</CardTitle>
            <CardDescription>View all your past transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentHistory && paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Method</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment: Payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.razorpay_order_id}</TableCell>
                        <TableCell className="font-medium">
                          ₹{payment.amount} {payment.currency}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{new Date(payment.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(payment.created_at).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {payment.payment_method}
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex px-2 py-1 rounded-full text-sm font-medium
                            ${payment.status === 'captured' ? 'bg-green-100 text-green-800' : ''}
                            ${payment.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                            ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          `}>
                            {getFormattedStatus(payment.status)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No payment history available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Card at bottom */}
        <Card className="mt-auto">
          <CardHeader>
            <CardTitle className="text-xl">Need Help?</CardTitle>
            <CardDescription>We're here to assist you with any questions</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactFormModal />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
