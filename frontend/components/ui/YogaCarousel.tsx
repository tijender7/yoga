// File: components/YogaCarousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
    <div className="max-w-4xl mx-auto relative">
      <div className="relative h-64 md:h-96 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            src={images[currentIndex]} 
            alt={`Student ${currentIndex}`} 
            width={500}
            height={300}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2">
        &lt;
      </button>
      <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2">
        &gt;
      </button>
    </div>
  );
};

export default YogaCarousel;