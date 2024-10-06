'use client'

import React, { useState, useEffect } from 'react';

interface FlowingYogaEnergyBackgroundProps {
  className?: string;
}

const FlowingYogaEnergyBackground: React.FC<FlowingYogaEnergyBackgroundProps> = ({ className = '' }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate(t) {
      setTime(t / 1000);
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const wave = (x: number, amplitude: number, frequency: number, phase: number) => 
    amplitude * Math.sin(frequency * x + phase + time);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Energy waves */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M 0 ${50 + wave(0, 10, 0.2, i * 2)}
               Q 25 ${50 + wave(25, 10, 0.2, i * 2)},
                 50 ${50 + wave(50, 10, 0.2, i * 2)},
                 75 ${50 + wave(75, 10, 0.2, i * 2)},
                 100 ${50 + wave(100, 10, 0.2, i * 2)}`}
            fill="none"
            stroke={`rgba(255, 255, 255, ${0.1 + i * 0.1})`}
            strokeWidth="0.5"
          />
        ))}
        
        {/* Yoga figure */}
        <path
          d={`M 50 ${30 + wave(0, 2, 1, 0)}
             C 60 ${40 + wave(25, 2, 1, 0)},
               40 ${60 + wave(50, 2, 1, 0)},
               50 ${70 + wave(75, 2, 1, 0)}
             L 50 85
             M 40 ${65 + wave(0, 2, 1, Math.PI)}
             L 60 ${65 + wave(0, 2, 1, Math.PI)}`}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
        />
        
        {/* Energy particles */}
        {[...Array(10)].map((_, i) => (
          <circle
            key={i}
            cx={i * 10}
            cy={50 + wave(i * 10, 10, 0.2, i * 0.2)}
            r="0.5"
            fill="white"
            opacity={Math.round((0.5 + Math.sin(time + i) * 0.5) * 100) / 100}
          />
        ))}
      </svg>
    </div>
  );
};

export default FlowingYogaEnergyBackground;