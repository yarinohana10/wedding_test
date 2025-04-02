
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

export default function ConfettiLoader() {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore) {
      // Set as visited for future reference
      localStorage.setItem('hasVisitedBefore', 'true');
      
      // Activate confetti
      setIsActive(true);
      
      // Run confetti for 8 seconds (longer duration)
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
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
