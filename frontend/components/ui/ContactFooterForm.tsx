import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from '@/lib/supabase'

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactFooterForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Insert message into Supabase
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{
          name: form.name,
          email: form.email,
          message: form.message,
        }])

      if (dbError) throw dbError

      // Send email notification
      const response = await fetch('/api/send-contact-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      toast.success("Message sent successfully! We'll get back to you soon.")
      setIsOpen(false)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full text-black border-black hover:bg-black hover:text-white transition-colors"
        >
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black font-semibold">Get in Touch</DialogTitle>
          <DialogDescription className="text-gray-600">
            Send us a message and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-medium">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-500"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-500"
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-black font-medium">Message</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-500 min-h-[100px]"
              placeholder="How can we help you?"
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