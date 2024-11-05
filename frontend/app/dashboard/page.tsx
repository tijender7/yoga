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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

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
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)  // Take first two initials if available
    .join('');
};

// Add these utility functions at the top of the file
const formatTimeForTimezone = (hour: number, minute: number, timezone: string) => {
  const date = new Date();
  date.setHours(hour, minute, 0); // Set to 6:00 German time
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    hour12: true
  }).format(date);
};

const getSessionTimes = () => {
  // German time (CET) - 6:00 AM to 7:00 PM
  const germanStart = formatTimeForTimezone(6, 0, 'Europe/Berlin');
  const germanEnd = formatTimeForTimezone(19, 0, 'Europe/Berlin');
  
  // Convert to Indian time (IST)
  const indianStart = formatTimeForTimezone(6, 0, 'Asia/Kolkata');
  const indianEnd = formatTimeForTimezone(19, 0, 'Asia/Kolkata');
  
  // Convert to US Eastern time (EST)
  const usStart = formatTimeForTimezone(6, 0, 'America/New_York');
  const usEnd = formatTimeForTimezone(19, 0, 'America/New_York');

  return {
    german: `${germanStart} - ${germanEnd} (CET)`,
    india: `${indianStart} - ${indianEnd} (IST)`,
    us: `${usStart} - ${usEnd} (EST)`
  };
};

// Update isSessionTime function to handle different timezones
const isSessionTime = () => {
  // Get current time in Berlin timezone (base timezone for classes)
  const now = new Date();
  const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const day = berlinTime.getDay();
  const hour = berlinTime.getHours();
  
  // Check if it's Monday-Friday (1-5) and between 6 AM and 7 PM Berlin time
  const isWeekday = day >= 1 && day <= 5;
  const isWorkingHour = hour >= 6 && hour < 19;

  return isWeekday && isWorkingHour;
};

// Optional: Add a function to show next available session
const getNextSession = () => {
  const now = new Date();
  const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const day = berlinTime.getDay();
  const hour = berlinTime.getHours();

  if (day === 0 || day === 6) {
    // If weekend, next session is Monday
    const daysUntilMonday = day === 0 ? 1 : 2;
    const nextSession = new Date(berlinTime);
    nextSession.setDate(nextSession.getDate() + daysUntilMonday);
    nextSession.setHours(6, 0, 0, 0);
    return nextSession;
  } else if (hour >= 19) {
    // If after 7 PM, next session is tomorrow at 6 AM
    const nextSession = new Date(berlinTime);
    nextSession.setDate(nextSession.getDate() + 1);
    nextSession.setHours(6, 0, 0, 0);
    return nextSession;
  } else if (hour < 6) {
    // If before 6 AM, next session is today at 6 AM
    const nextSession = new Date(berlinTime);
    nextSession.setHours(6, 0, 0, 0);
    return nextSession;
  }
  
  return null; // Session is currently active
};

// Add this to show next session time in the UI
const NextSessionInfo = () => {
  const nextSession = getNextSession();
  if (!nextSession) return null;

  return (
    <div className="text-sm text-gray-600">
      Next session starts: {nextSession.toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateStyle: 'full',
        timeStyle: 'short'
      })} (your local time)
    </div>
  );
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
        // Fetch user details from both users and profiles tables
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            full_name,
            username,
            phone
          `)
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
                  {getInitials(userData?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-2xl">
                  {userData?.full_name || userData?.username || 'User'}
                </CardTitle>
                <CardDescription className="text-base">{userData?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Today's Class Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Today's Class Links</CardTitle>
            <CardDescription>Choose your preferred class mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Times Display */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-2">Session Timings (Monday to Friday)</h3>
              <div className="grid gap-2 text-sm">
                <p>🇩🇪 Germany: {getSessionTimes().german}</p>
                <p>🇮🇳 India: {getSessionTimes().india}</p>
                <p>🇺🇸 USA: {getSessionTimes().us}</p>
              </div>
              {isSessionTime() ? (
                <div className="mt-2 text-green-600 font-medium">
                  ✅ Session is currently active
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-red-600 font-medium">
                    ⏰ Session is currently inactive
                  </div>
                  <NextSessionInfo />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Interactive Mode (Google Meet) */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Interactive Mode</h3>
                <p className="text-sm text-gray-600 mb-4">Join via Google Meet - Interact with other participants</p>
                <div className="flex items-center gap-2 mb-4">
                  <Input 
                    readOnly 
                    value="https://meet.google.com/eis-yetd-uqt"
                    className="bg-gray-50"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigator.clipboard.writeText("https://meet.google.com/eis-yetd-uqt");
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => window.open("https://meet.google.com/eis-yetd-uqt", "_blank")}
                    disabled={!isSessionTime()}
                  >
                    {isSessionTime() ? "Join Now" : "Session Inactive"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const subject = "Your Interactive Yoga Class Link";
                      const body = `Here's your Google Meet link for yoga classes:

Link: https://meet.google.com/eis-yetd-uqt

Session Timings:
Germany: ${getSessionTimes().german}
India: ${getSessionTimes().india}
USA: ${getSessionTimes().us}

Sessions are held Monday to Friday.`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                  >
                    Email Link
                  </Button>
                </div>
              </div>

              {/* Private Mode (Zoom) */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Private Mode</h3>
                <p className="text-sm text-gray-600 mb-4">Join via Zoom - Private session without participant interaction</p>
                <div className="flex items-center gap-2 mb-4">
                  <Input 
                    readOnly 
                    value="https://us06web.zoom.us/j/89432205986"
                    className="bg-gray-50"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigator.clipboard.writeText("https://us06web.zoom.us/j/89432205986");
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => window.open("https://us06web.zoom.us/j/89432205986", "_blank")}
                    disabled={!isSessionTime()}
                  >
                    {isSessionTime() ? "Join Now" : "Session Inactive"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const subject = "Your Private Yoga Class Link";
                      const body = `Here's your Zoom link for yoga classes:

Link: https://us06web.zoom.us/j/89432205986

Session Timings:
Germany: ${getSessionTimes().german}
India: ${getSessionTimes().india}
USA: ${getSessionTimes().us}

Sessions are held Monday to Friday.`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                  >
                    Email Link
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Card */}
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

        {/* Help Card */}
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
