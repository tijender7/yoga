// File: components/YogaCarousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YogaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const images = Array.from({ length: 13 }, (_, i) => 
    `https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/student${i}.jpeg`
  );

  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(images.map((src) =>
          new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          })
        ));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Set to true even on error to show something
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagesLoaded, images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!imagesLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full h-96 md:h-[500px]">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Student ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === currentIndex}
          className={`object-contain transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
        <ChevronLeft />
      </button>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
        <ChevronRight />
      </button>
    </div>
  );
};

export default YogaCarousel;