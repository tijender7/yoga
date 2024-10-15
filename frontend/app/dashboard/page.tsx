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

// Mock data for demonstration purposes
const mockUserData = {
  name: "Sarah Davis",
  email: "sarah.davis@example.com",
  subscriptionPlan: "1-Year Premium",
  subscriptionExpiry: "December 31, 2023",
  avatar: "/placeholder.svg?height=100&width=100",
}

const mockPayments = [
  { id: "PAY-001", orderId: "ORD-001", date: "May 1, 2023", plan: "1-Year Premium", amount: "$199.99" },
  { id: "PAY-002", orderId: "ORD-002", date: "Apr 1, 2022", plan: "6-Month Premium", amount: "$119.99" },
  { id: "PAY-003", orderId: "ORD-003", date: "Oct 1, 2021", plan: "3-Month Premium", amount: "$69.99" },
]

async function fetchSubscriptionData(userId: string) {
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  const { data: paymentsData, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (subscriptionError || paymentsError) {
    console.error('Error fetching data:', subscriptionError || paymentsError)
    return null
  }

  return {
    subscription: subscriptionData[0],
    payments: paymentsData
  }
}

export default function Dashboard() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [user, setUser] = useState<User | null>(null)  // Update the type here
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/auth')
      }
    }
    checkUser()
  }, [router])

  const handleCancelSubscription = () => {
    // In a real app, you'd implement the cancellation logic here
    console.log("Subscription cancelled")
    setShowCancelDialog(false)
  }

  const handleUpgradeSubscription = () => {
    // In a real app, you'd implement the upgrade logic here
    console.log("Navigating to upgrade options")
  }

  if (!user) {
    return <div>Loading...</div>
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
                <AvatarImage src={mockUserData.avatar} alt={mockUserData.name} />
                <AvatarFallback>{mockUserData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{mockUserData.name}</h3>
                <p className="text-sm text-muted-foreground">{mockUserData.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Plan:</strong> {mockUserData.subscriptionPlan}</p>
              <p><strong>Expires:</strong> {mockUserData.subscriptionExpiry}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
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
            </CardFooter>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent payments and subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.orderId}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.plan}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Total payments in the past month: {mockPayments.length}</p>
          </CardFooter>
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
