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

// Update the UI part where we show class links
const ClassLinkSection = ({ title, description, link, meetingType }: {
  title: string;
  description: string;
  link: string;
  meetingType: "Meet" | "Zoom";
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center gap-2 mb-4">
        <Input 
          readOnly 
          value={link}
          className="bg-gray-50"
        />
        <Button 
          variant="outline" 
          onClick={() => {
            navigator.clipboard.writeText(link);
            toast.success("Link copied to clipboard!");
          }}
        >
          Copy
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="default"
          onClick={() => window.open(link, "_blank")}
        >
          Open {meetingType}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const subject = `Your ${title} Link`;
            const body = `Here's your ${meetingType} link for yoga classes:

Link: ${link}

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
  );
};

export default function Dashboard() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState<Payment[] | null>(null);
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
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
            <CardTitle className="text-xl font-semibold">Class Links</CardTitle>
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ClassLinkSection 
                title="Interactive Mode"
                description="Join via Google Meet - Interact with other participants"
                link="https://meet.google.com/eis-yetd-uqt"
                meetingType="Meet"
              />
              
              <ClassLinkSection 
                title="Private Mode"
                description="Join via Zoom - Private session without participant interaction"
                link="https://us06web.zoom.us/j/89432205986"
                meetingType="Zoom"
              />
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
