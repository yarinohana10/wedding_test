
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

export default function ConfettiLoader() {
  const [isActive, setIsActive] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Run confetti for 4 seconds
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={700}
        gravity={0.2}
        initialVelocityY={10}
        tweenDuration={5000}
        colors={['#F0B6BC', '#E8D7C3', '#D4AF7A', '#F9F5F2', '#1A1A2E', '#FFD1DC', '#FFEFD5']}
      />
    </div>
  );
}
