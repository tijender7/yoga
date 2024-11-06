// pages/page.tsx (or pages/index.tsx depending on your setup)

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Facebook, Instagram, MessageCircle, Star, CheckCircle2, Leaf, Heart, Users, Shield, Clock, Zap, Brain, Sun, Sunrise, Sunset, Moon, Baby, Dumbbell, Flame, Check } from 'lucide-react';
import YogaCarousel from '@/components/ui/YogaCarousel';
import FlowingYogaEnergyBackground from '@/components/ui/FlowingYogaEnergyBackground';
import StickyJoinForm from '@/components/ui/StickyJoinForm';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import TestimonialsCarousel from '@/components/ui/TestimonialsCarousel';
import BookFreeClass from '@/components/ui/BookFreeClass';
import { Toaster } from 'sonner';
import Header from '@/components/ui/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fetchYogaPricing } from '@/lib/paymentActions';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import PricingSection from '@/components/PricingSection'; // New pricing section
// import PricingSection from '@/components/PricingSection_old'; // Old pricing section (commented out)
import ContactFooterForm from '@/components/ui/ContactFooterForm'

interface PricingPlan {
  id: number;
  region: string;
  plan_type: string;
  monthly_price: number;
  total_price: number;
  savings: number;
  currency: string;
  strike_price: number;
  discounted_monthly_price: number;
  discount_percentage: number;
}

export default function YogaLanding() {
  // Remove pricing-related state and functions from here

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <ScrollAnimation>
          <section className="w-full py-12 md:py-24 lg:py-32 relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <FlowingYogaEnergyBackground className="opacity-20" />
            </div>
            <div className="container px-4 md:px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 text-shadow-lg">
                  Transform Your Mind & Body with YogForever
                </h1>
                <p className="text-lg sm:text-xl text-gray-100 mb-8 bg-gray-900/30 p-4 rounded-lg backdrop-blur-sm mx-auto">
                  Join our tailored classes for all levels and invest in your future health.
                  Age gracefully with yoga - your key to a vibrant, pain-free life.
                </p>
                <div className="flex justify-center">
                  <BookFreeClass 
                    buttonText="Start Free Trial Class" 
                    buttonClassName="relative w-full sm:w-auto bg-white/90 text-gray-900 hover:bg-white text-xl font-semibold transition-all duration-200 px-10 py-5 rounded-lg border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>
        
        <StickyJoinForm />
        
        <ScrollAnimation>
          <section className="w-full py-10 md:py-20 lg:py-28 bg-gray-100">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Our Students in Action</h2>
              <YogaCarousel />
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation>
          <section id="about" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">About Us</h2>
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                {/* Left column - text content */}
                <Card className="p-6 h-full flex flex-col justify-between" style={{ minHeight: '660px' }}>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Our Philosophy & Benefits of Yoga</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Leaf className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Transformative power of yoga for all levels</span>
                        </li>
                        <li className="flex items-start">
                          <Heart className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Holistic practice nurturing mind, body, and spirit</span>
                        </li>
                        <li className="flex items-start">
                          <Users className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Inclusive classes for all ages and fitness levels</span>
                        </li>
                        <li className="flex items-start">
                          <Clock className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Feel younger and more energetic</span>
                        </li>
                        <li className="flex items-start">
                          <Zap className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Increased flexibility and strength</span>
                        </li>
                        <li className="flex items-start">
                          <Brain className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Stress reduction and improved mental clarity</span>
                        </li>
                        <li className="flex items-start">
                          <Sun className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Investment in long-term health and well-being</span>
                        </li>
                        <li className="flex items-start">
                          <Sunrise className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Improved posture and balance</span>
                        </li>
                        <li className="flex items-start">
                          <Sunset className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Better sleep quality and relaxation</span>
                        </li>
                        <li className="flex items-start">
                          <Dumbbell className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Enhanced muscle tone and strength</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Our Journey</h3>
                      <p className="text-sm text-gray-700">Founded in 2010, YogaHarmony has grown from a local studio to a global online platform, connecting thousands of yoga enthusiasts worldwide.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Expert-Led Instruction</h3>
                      <p className="text-sm text-gray-700 mb-2">Our lead instructor, Suman Arya, holds a 500-hour Yoga Teacher Certification.</p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Shield className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Advanced expertise in yoga philosophy and techniques</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-sm text-gray-700">Safety-focused instruction for all levels</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 italic">"Yoga is not just exercise, it's an investment in your lifelong health and well-being."</p>
                  </div>
                </Card>
                
                {/* Right column - image and details */}
                <Card className="p-6 h-full flex flex-col justify-between" style={{ minHeight: '660px' }}>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full aspect-[4/3] max-w-[500px] mx-auto bg-gray-100 rounded-lg overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src="https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/suman_masi_image.jpg"
                          alt="Suman Arya"
                          fill
                          sizes="(max-width: 500px) 100vw, 500px"
                          style={{ objectFit: 'cover' }}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="w-full text-center">
                      <h3 className="text-xl font-bold text-gray-800">Suman Arya</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">500-Hour Certified Yoga Instructor</p>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        With over a decade of experience, Suman Arya brings unparalleled expertise to every class, offering a transformative experience for all levels.
                      </p>
                    </div>
                  </div>
                  
                  {/* Updated content with correct text wrapping and alignment */}
                  <div className="mt-6 space-y-4 text-left">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Certifications:</h4>
                      <ul className="list-disc list-outside text-sm text-gray-700 pl-4">
                        <li className="text-wrap">500-Hour Yoga Teacher Certification</li>
                        <li className="text-wrap">Certified Yoga Protocol Instructor by The Yoga Certification Board, Ministry of AYUSH, Government of India</li>
                        <li className="text-wrap">Specialized in various yoga styles including Hatha, Vinyasa, and Restorative Yoga</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Class Offerings:</h4>
                      <ul className="list-disc list-outside text-sm text-gray-700 pl-4">
                        <li className="text-wrap">Beginner-friendly yoga sessions</li>
                        <li className="text-wrap">Advanced posture workshops</li>
                        <li className="text-wrap">Meditation and pranayama classes</li>
                        <li className="text-wrap">Yoga for stress relief and relaxation</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation>
          <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-white scroll-mt-14">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-800">
                Our Specialized Services
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Posture Correction Card */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="w-6 h-6 text-primary" />
                      Posture Correction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Spine issues treatment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Shoulder problem solutions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Gut health improvement</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Strength Training Card */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-6 h-6 text-primary" />
                      Strength Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Core strength development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Muscle toning exercises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Body weight training</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Complete Fitness Card */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-primary" />
                      Complete Fitness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Flexibility training</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Strength conditioning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Balanced workout routines</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollAnimation>
        
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 scroll-mt-14">
          <PricingSection />
        </section>
        
        <ScrollAnimation>
          <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">
                What Our Clients Say
              </h2>
              <TestimonialsCarousel />
            </div>
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation>
          <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Why Choose Our Online Yoga Classes?</h2>
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  { title: 'Affordable Pricing', icon: CheckCircle2 },
                  { title: 'Certified Instructors', icon: CheckCircle2 },
                  { title: 'Classes for All Levels', icon: CheckCircle2 },
                  { title: 'Accessible Anytime, Anywhere', icon: CheckCircle2 },
                ].map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <benefit.icon className="w-12 h-12 mb-4 text-primary" />
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">Experience the benefits of yoga with our flexible and high-quality classes.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4 text-gray-800">Ready to transform your life?</h2>
              <p className="max-w-[600px] text-gray-700 md:text-xl dark:text-gray-300 mx-auto mb-8">
                Join our community today and start your journey towards a healthier, more balanced you.
              </p>
              <BookFreeClass buttonText="Get Started" />
            </div>
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4 text-gray-800">Try a Free Class This Weekend</h2>
              <p className="max-w-[600px] text-gray-700 md:text-xl dark:text-gray-300 mx-auto mb-8">
                Experience the benefits of our yoga classes with no commitment. Join our free Weekend trial class and see the difference for yourself.
              </p>
              <BookFreeClass />
            </div>
          </section>
        </ScrollAnimation>
        
        <ScrollAnimation>
          <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                {[
                  { question: 'What is the duration of each class?', answer: 'Our classes typically last 60 minutes, providing a comprehensive yoga experience.' },
                  { question: 'Do I need any equipment for the classes?', answer: 'For most classes, you\'ll only need a yoga mat. We\'ll inform you in advance if any additional props like blocks or straps are required for specific sessions.' },
                  { question: 'What is your cancellation policy?', answer: 'You can cancel or reschedule a class up to 2 hours before it starts without any penalty. However, for refunds on paid subscriptions, we have a 2-day cancellation policy from the date of purchase.' },
                  { question: 'Can I choose between private and interactive sessions?', answer: 'Yes! We offer two session types at the same price: Private Mode where other participants won\'t see you, and Interactive Mode where you can interact with other participants. It\'s your choice how you want to experience the session.' },
                  { question: 'How often are classes held?', answer: 'We offer classes five days a week, giving you flexibility in your practice schedule.' },
                  { question: 'Are the classes suitable for beginners?', answer: 'Absolutely! We have classes for all levels, from beginners to advanced practitioners. Our instructors provide modifications to suit your experience level.' },
                  { question: 'What styles of yoga do you offer?', answer: 'We offer a variety of yoga styles including Hatha, Vinyasa, Restorative, and more. Check our class schedule for specific style offerings.' },
                  { question: 'How do I join the online classes?', answer: 'Once you\'ve booked a class, you\'ll receive a Zoom link via email. Simply click the link at the scheduled time to join the session.' },
                  { question: 'What happens if I experience technical difficulties during a class?', answer: 'Our support team is available during class hours to assist with any technical issues. You can reach out via the chat function or email for immediate help.' },
                  { question: 'Can I access recorded classes if I miss a live session?', answer: 'Unfortunately, we don\'t offer recorded classes. Our focus is on providing real-time, interactive experiences to ensure proper guidance and form correction.' },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-gray-800">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </ScrollAnimation>
      </main>
      <footer id="contact" className="w-full py-12 bg-white border-t">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black">YogForever</h3>
              <p className="text-gray-600 max-w-sm">
                Transforming lives through the power of yoga. Join our community and start your wellness journey today.
              </p>
              <div className="pt-2">
                <p className="text-gray-600">Email us at:</p>
                <a href="mailto:support@yogforever.com" className="text-black font-medium hover:text-gray-600 transition-colors">
                  support@yogforever.com
                </a>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-black">Get in Touch</h4>
              <p className="text-gray-600">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="mt-4">
                <ContactFooterForm />
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-600 text-sm">
                © {new Date().getFullYear()} YogForever. All rights reserved.
              </div>
              <div className="flex items-center space-x-8">
                <Link 
                  href="/privacy-policy" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Toaster /> {/* Ensure Toaster is included if used across the app */}
    </div>
  );
}
