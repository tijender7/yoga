// File: components/YogaCarousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ResponsiveImage from './ResponsiveImage';

const YogaCarousel = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const imageUrls = Array.from({ length: 13 }, (_, i) => 
      `https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/student${i}.jpeg`
    );
    setImages(imageUrls);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto relative overflow-hidden">
      <div className="relative aspect-[16/9] bg-gray-100">
        <ResponsiveImage 
          src={images[currentIndex]} 
          alt={`Student ${currentIndex}`} 
          priority={currentIndex === 0}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
        />
      </div>
      <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10">
        &lt;
      </button>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10">
        &gt;
      </button>
    </div>
  );
};

export default YogaCarousel;