import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { HelpCircle } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser' // If you have a user hook

// Form interface type
interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactFormModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser() // Get current user if available

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Insert message into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: form.name,
            email: form.email,
            message: form.message,
            user_id: user?.id // Add user_id if user is logged in
          }
        ])

      if (error) throw error

      // Optional: Send email notification using Edge function
      await fetch('/api/send-contact-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        }),
      })
      
      toast.success("Support request sent successfully! We'll get back to you soon.")
      setIsOpen(false)
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setForm(prev => ({
      ...prev,
      [id]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
        >
          <HelpCircle className="h-5 w-5" />
          Contact Support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Contact Support</DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill out this form and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleInputChange}
              required
              className="bg-white border-gray-300 text-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              required
              className="bg-white border-gray-300 text-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-black">Message</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={handleInputChange}
              required
              className="bg-white border-gray-300 text-black min-h-[100px]"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}