
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

export default function ConfettiLoader() {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore) {
      // Set as visited for future reference
      localStorage.setItem('hasVisitedBefore', 'true');
      
      // Activate confetti with fade-in animation
      setIsActive(true);
      setTimeout(() => setIsVisible(true), 100);
      
      // Run confetti for 8 seconds and add fade-out animation
      const timer = setTimeout(() => {
        setIsVisible(false); // Start fade-out
        setTimeout(() => setIsActive(false), 1000); // Remove component after animation
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isActive) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={700}
        gravity={0.1} // Reduced gravity for slower fall
        initialVelocityY={15}
        tweenDuration={8000} // Longer duration
        colors={['#F0B6BC', '#E8D7C3', '#D4AF7A', '#F9F5F2', '#1A1A2E', '#FFD1DC', '#FFEFD5']}
      />
    </div>
  );
}
