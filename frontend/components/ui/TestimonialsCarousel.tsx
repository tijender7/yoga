"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

// Testimonials data with all 6 reviews
const testimonials = [
  {
    name: 'Priya Sharma',
    quote: 'YogForever ne meri life transform kar di! Flexibility aur strength dono improve hui hai.',
    rating: 5,
    image: 'https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/test1.jpg',
    location: 'Mumbai, India'
  },
  {
    name: 'Emma Wilson',
    quote: 'The best yoga classes Ive ever attended. The instructors are amazing!',
    rating: 5,
    image: 'https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/test2.jpg',
    location: 'Berlin, Germany'
  },
  {
    name: 'Olivia Thompson',
    quote: 'Incredible community and expert guidance. My posture has improved significantly!',
    rating: 5,
    image: 'https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/test3.jfif',
    location: 'New York, USA'
  },
  {
    name: 'Rajesh Kumar',
    quote: '6 mahine se regular classes attend kar raha hoon. Back pain completely thik ho gaya!',
    rating: 5,
    image: '/testimonials/rajesh.jpg',
    location: 'Delhi, India'
  },
  {
    name: 'Sarah Miller',
    quote: 'The convenience of online classes with the personal touch of in-person training. Simply amazing!',
    rating: 5,
    image: '/testimonials/sarah.jpg',
    location: 'London, UK'
  },
  {
    name: 'Maria Garcia',
    quote: 'Found my peace and strength through these classes. The instructors are very attentive!',
    rating: 5,
    image: '/testimonials/maria.jpg',
    location: 'Barcelona, Spain'
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-play functionality with faster interval (3 seconds instead of 5)
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000); // Changed from 5000 to 3000 for faster rotation

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  // Show 3 testimonials at a time on desktop, 1 on mobile
  const getVisibleTestimonials = () => {
    const visibleCount = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 1;
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % testimonials.length;
      items.push(testimonials[index]);
    }
    return items;
  };

  return (
    <div className="relative w-full px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden">
          {/* Testimonials Container */}
          <div className="flex transition-transform duration-300 ease-in-out gap-6">
            {getVisibleTestimonials().map((testimonial, idx) => (
              <Card 
                key={`${testimonial.name}-${idx}`} 
                className="flex-shrink-0 w-full lg:w-1/3 transform hover:scale-105 transition-transform duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                      <div className="flex mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => {
              setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
              setIsAutoPlaying(false);
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setCurrentIndex((prev) => (prev + 1) % testimonials.length);
              setIsAutoPlaying(false);
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation - Shows all 6 dots */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}