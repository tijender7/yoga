'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function StickyJoinForm() {
  const [isSticky, setIsSticky] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const communityForm = document.getElementById('community-form');
      if (communityForm) {
        setIsSticky(offset > communityForm.offsetTop);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!name || !email) {
      toast.error('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        toast.error('This email is already registered. Please use a different email or sign in.');
        setIsLoading(false);
        return;
      }

      // Call backend API to create user
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          interest,
          source: 'sticky_header',
          password: Math.random().toString(36).slice(-8)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user in backend');
      }

      toast.success('Thank you for joining! We\'ll be in touch soon.');
      setName('');
      setEmail('');
      setInterest('');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="community-form" className={`w-full bg-white transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''}`}>
      <div className="container px-2 sm:px-4 md:px-6 mx-auto py-2 sm:py-3 md:py-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-black">Join Our Community</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end sm:space-x-2 md:space-x-4">
            <div className="flex-1 mb-2 sm:mb-0">
              <Input 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-8 sm:h-10 text-sm text-black bg-white"
              />
            </div>
            <div className="flex-1 mb-2 sm:mb-0">
              <Input 
                placeholder="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-8 sm:h-10 text-sm text-black bg-white"
              />
            </div>
            <div className="flex-1 mb-2 sm:mb-0">
              <Input 
                placeholder="Interest (e.g., Beginner Yoga)" 
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full h-8 sm:h-10 text-sm text-black bg-white"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-8 sm:h-10 text-sm">
              {isLoading ? 'Joining...' : 'Join Now'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
