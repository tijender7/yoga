// File: components/YogaCarousel.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const YogaCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollCarousel = () => {
      if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth)) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scrollCarousel, 20);

    return () => clearInterval(intervalId);
  }, []);

  const imageUrl = "https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/main_image.png?t=2024-09-18T07%3A45%3A34.062Z";

  return (
    <div className="w-full overflow-hidden">
      <div ref={carouselRef} className="flex whitespace-nowrap">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="inline-block mr-4">
            <Image
              src={imageUrl}
              alt={`Student doing yoga ${index + 1}`}
              width={300}
              height={200}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YogaCarousel;