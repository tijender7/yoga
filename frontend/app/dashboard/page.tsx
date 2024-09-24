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
import Link from "next/link" // Import Link component

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

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link href="/"> {/* Wrap YogaHarmony text with Link component */}
            <h1 className="text-2xl font-bold text-black cursor-pointer">YogaHarmony</h1>
          </Link>
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
                <ProgressCard title="Flexibility" value="+15%" change="+2%" />
                <ProgressCard title="Strength" value="+8%" change="+1%" />
                <ProgressCard title="Balance" value="+12%" change="+3%" />
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
                    <div className="relative">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="rounded-md border bg-white" // Add bg-white class here
                        disabled={(date) => 
                          !mockUserData.isPremium && (date.getDay() !== 0 && date.getDay() !== 6)
                        }
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-between items-center px-2",
                          caption_label: "text-sm font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "relative left-0",
                          nav_button_next: "relative right-0",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
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
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white p-4 shadow-lg"> {/* Update bg-background to bg-white */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black">Notifications</h2> {/* Add text-black class */}
            <Button variant="ghost" size="sm" onClick={() => setShowNotificationCenter(false)} className="text-black"> {/* Add text-black class */}
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="font-medium text-black">New class available</p> {/* Add text-black class */}
              <p className="text-sm text-black">A new Vinyasa Flow class has been added for tomorrow.</p> {/* Add text-black class */}
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="font-medium text-black">Upcoming session reminder</p> {/* Add text-black class */}
              <p className="text-sm text-black">You have a Hatha Yoga session in 1 hour.</p> {/* Add text-black class */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <Card>
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