"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar as CalendarIcon, CreditCard, HelpCircle, LogOut, Moon, Sun, Upload, User, Award, TrendingUp, Zap, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

// Mock data for demonstration purposes
const mockUserData = {
  name: "Sarah Davis",
  email: "sarah.davis@example.com",
  isPremium: true,
  subscriptionPlan: "1-Year Premium",
  subscriptionExpiry: "December 31, 2023",
  avatar: "/placeholder-avatar.jpg",
  totalSessions: 48,
  sessionsThisMonth: 12,
  streak: 7,
  level: 3
}

const mockSessions = [
  { id: 1, name: "Vinyasa Flow", date: new Date(2023, 5, 10, 10, 0), instructor: "Emily Chen", difficulty: "Intermediate" },
  { id: 2, name: "Hatha Yoga", date: new Date(2023, 5, 12, 18, 0), instructor: "Michael Brown", difficulty: "Beginner" },
  { id: 3, name: "Yin Yoga", date: new Date(2023, 5, 17, 19, 0), instructor: "Lisa Wong", difficulty: "All Levels" },
]

const mockPayments = [
  { date: "May 1, 2023", plan: "1-Year Premium", amount: "$199.99", method: "PayPal" },
  { date: "Apr 1, 2022", plan: "6-Month Premium", amount: "$119.99", method: "Credit Card" },
]

export default function Dashboard() {
  const router = useRouter()
  const { user, setUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSessions, setAvailableSessions] = useState<any[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    app: true,
    calendar: true,
  })
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    // In a real app, you'd fetch available sessions for the selected date
    setAvailableSessions(mockSessions.filter(session => session.date.toDateString() === date?.toDateString()))
  }

  const handleBookSession = (sessionId: number) => {
    // In a real app, you'd implement the booking logic here
    console.log(`Booked session ${sessionId}`)
  }

  const handleNotificationSettingChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Home page par redirect karein
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Error handling logic add kar sakte hain
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-black">Yoga Dashboard</h1>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowNotificationCenter(!showNotificationCenter)} className="text-black">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 bg-white">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mockUserData.avatar} alt={mockUserData.name} />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{mockUserData.name}</h2>
                  <p className="text-sm text-muted-foreground">{mockUserData.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {mockUserData.isPremium ? "Premium User" : "Free User"}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{mockUserData.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockUserData.sessionsThisMonth}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockUserData.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 bg-white">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Level {mockUserData.level}</p>
                  <p className="text-sm text-muted-foreground">Intermediate Yogi</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <Progress value={33} className="h-2 w-full" />
              <p className="mt-2 text-sm text-muted-foreground">67 XP to next level</p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <ProgressCard title="Flexibility" value="+15%" change="+2%" />
                <ProgressCard title="Strength" value="+8%" change="+1%" />
                <ProgressCard title="Balance" value="+12%" change="+3%" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="calendar" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Yoga Session Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="payments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Payment History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Yoga Session Calendar</CardTitle>
                <CardDescription>View and book your upcoming yoga sessions</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border"
                      disabled={(date: Date) => 
                        !mockUserData.isPremium && (date.getDay() !== 0 && date.getDay() !== 6)
                      }
                    />
                    <div>
                      <h3 className="mb-2 font-semibold">Available Sessions for {selectedDate?.toDateString()}</h3>
                      {availableSessions.length > 0 ? (
                        availableSessions.map((session) => (
                          <Card key={session.id} className="mb-2 bg-white">
                            <CardHeader className="pb-2">
                              <CardTitle>{session.name}</CardTitle>
                              <CardDescription>
                                {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Instructor: {session.instructor}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">{session.difficulty}</Badge>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button>Book Now</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Book {session.name}</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to book this session for {session.date.toLocaleString()}?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Button onClick={() => handleBookSession(session.id)}>Confirm Booking</Button>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className="bg-white">
                          <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">No sessions available for this date.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payments" className="mt-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your recent payments and subscriptions</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPayments.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{payment.plan}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates about your upcoming sessions</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.email}
                    onCheckedChange={() => handleNotificationSettingChange('email')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-notifications">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                  </div>
                  <Switch
                    id="app-notifications"
                    checked={notificationSettings.app}
                    onCheckedChange={() => handleNotificationSettingChange('app')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="calendar-notifications">Add to Calendar</Label>
                    <p className="text-sm text-muted-foreground">Automatically add booked sessions to your calendar</p>
                  </div>
                  <Switch
                    id="calendar-notifications"
                    checked={notificationSettings.calendar}
                    onCheckedChange={() => handleNotificationSettingChange('calendar')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button variant="outline" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" /> FAQs
              </Button>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" /> Contact Support
              </Button>
              <Button variant="outline" className="w-full">
                <Zap className="mr-2 h-4 w-4" /> Quick Start Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      {showNotificationCenter && (
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black">Notifications</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowNotificationCenter(false)} className="text-black">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="font-medium text-black">New class available</p>
              <p className="text-sm text-gray-600">A new Vinyasa Flow class has been added for tomorrow.</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="font-medium text-black">Upcoming session reminder</p>
              <p className="text-sm text-gray-600">You have a Hatha Yoga session in 1 hour.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change} from last month</p>
      </CardContent>
    </Card>
  );
}