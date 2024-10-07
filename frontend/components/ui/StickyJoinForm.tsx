'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StickyJoinForm() {
  const [isSticky, setIsSticky] = useState(false);

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

  return (
    <section id="community-form" className={`w-full bg-white transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''}`}>
      <div className="container px-2 sm:px-4 md:px-6 mx-auto py-2 sm:py-3 md:py-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-black">Join Our Community</h2>
          <form className="flex flex-col sm:flex-row sm:items-end sm:space-x-2 md:space-x-4">
            <div className="flex-1 mb-2 sm:mb-0">
              <Input placeholder="Name" className="w-full h-8 sm:h-10 text-sm" />
            </div>
            <div className="flex-1 mb-2 sm:mb-0">
              <Input placeholder="Email" type="email" className="w-full h-8 sm:h-10 text-sm" />
            </div>
            <div className="flex-1 mb-2 sm:mb-0">
              <Input placeholder="Interest (e.g., Beginner Yoga)" className="w-full h-8 sm:h-10 text-sm" />
            </div>
            <Button type="submit" className="w-full sm:w-auto h-8 sm:h-10 text-sm">Join Now</Button>
          </form>
        </div>
      </div>
    </section>
  )
}