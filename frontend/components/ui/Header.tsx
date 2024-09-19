'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, CreditCard, LogOut } from 'lucide-react'

// GlowButton component
function GlowButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`
          bg-primary text-primary-foreground hover:bg-primary/90
          transition-all duration-200 ease-out
          px-6 py-2 rounded-full text-sm font-medium
          ${isHovered ? 'shadow-lg' : 'shadow'}
        `}
      >
        Start Free Trial
      </button>
      {isHovered && (
        <div className="absolute inset-0 -z-10 bg-primary/20 blur-xl rounded-full transition-opacity duration-200 ease-out opacity-75" />
      )}
    </div>
  )
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder state for user login

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
      <Link className="flex items-center justify-center" href="#">
        <span className="text-2xl font-bold text-primary">YogaHarmony</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="#about">About</Link>
        <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="#services">Services</Link>
        <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="#pricing">Pricing</Link>
        <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="#contact">Contact</Link>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-black" />
                <span className="sr-only">Open profile menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Login
            </Button>
          </Link>
        )}
        <GlowButton />
      </nav>
    </header>
  )
}