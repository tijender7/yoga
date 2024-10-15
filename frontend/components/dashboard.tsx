"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar as CalendarIcon, CreditCard, HelpCircle, LogOut, Moon, Sun, Upload, User, Award, TrendingUp, Zap } from "lucide-react"
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
  level: 5
  
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

export function DashboardComponent() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
    // In a real app, you'd apply the theme change here
  }

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

  return (
    <div className={`min-h-screen bg-background ${theme}`}>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Yoga Dashboard</h1>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowNotificationCenter(!showNotificationCenter)}>
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isLoading ? (
                <Skeleton className="h-24 w-24 rounded-full" />
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockUserData.avatar} alt={mockUserData.name} />
                  <AvatarFallback>{mockUserData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              )}
              <Button variant="ghost" size="sm" className="mt-2">
                <Upload className="mr-2 h-4 w-4" /> Change Photo
              </Button>
              {isLoading ? (
                <Skeleton className="mt-4 h-6 w-32" />
              ) : (
                <h3 className="mt-4 text-xl font-semibold">{mockUserData.name}</h3>
              )}
              {isLoading ? (
                <Skeleton className="mt-2 h-4 w-48" />
              ) : (
                <p className="text-sm text-muted-foreground">{mockUserData.email}</p>
              )}
              {isLoading ? (
                <Skeleton className="mt-2 h-6 w-24" />
              ) : (
                <Badge className="mt-2" variant="secondary">
                  {mockUserData.isPremium ? "Premium User" : "Free User"}
                </Badge>
              )}
              <div className="mt-4 flex w-full justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockUserData.totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockUserData.sessionsThisMonth}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockUserData.streak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
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
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Flexibility</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+15%</div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Strength</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+8%</div>
                    <p className="text-xs text-muted-foreground">+1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Balance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-muted-foreground">+3% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="calendar" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="calendar">Yoga Session Calendar</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Yoga Session Calendar</CardTitle>
                <CardDescription>View and book your upcoming yoga sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border"
                      disabled={(date) => 
                        !mockUserData.isPremium && (date.getDay() !== 0 && date.getDay() !== 6)
                      }
                    />
                    <div>
                      <h3 className="mb-2 font-semibold">Available Sessions for {selectedDate?.toDateString()}</h3>
                      {availableSessions.length > 0 ? (
                        availableSessions.map((session) => (
                          <Card key={session.id} className="mb-2">
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
                        <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your recent payments and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-background p-4 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">New class available</p>
              <p className="text-sm text-muted-foreground">A new Vinyasa Flow class has been added for tomorrow.</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">Upcoming session reminder</p>
              <p className="text-sm text-muted-foreground">You have a Hatha Yoga session in 1 hour.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}