
import React, { useState, useEffect } from 'react';
import { CalendarHeart } from 'lucide-react';

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Run immediately and then set interval
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [targetDate]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <CalendarHeart className="text-wedding-primary mr-2" size={24} />
        <h2 className="text-2xl font-bold text-wedding-dark">הספירה לאחור</h2>
      </div>
      
      <div className="flex justify-center gap-4">
        <div className="countdown-item animate-float">
          <span className="text-2xl font-bold text-wedding-dark">{timeLeft.days}</span>
          <span className="text-xs text-gray-500 mt-1">ימים</span>
        </div>
        
        <div className="countdown-item animate-float" style={{ animationDelay: "0.2s" }}>
          <span className="text-2xl font-bold text-wedding-dark">{timeLeft.hours}</span>
          <span className="text-xs text-gray-500 mt-1">שעות</span>
        </div>
        
        <div className="countdown-item animate-float" style={{ animationDelay: "0.4s" }}>
          <span className="text-2xl font-bold text-wedding-dark">{timeLeft.minutes}</span>
          <span className="text-xs text-gray-500 mt-1">דקות</span>
        </div>
        
        <div className="countdown-item animate-float" style={{ animationDelay: "0.6s" }}>
          <span className="text-2xl font-bold text-wedding-dark">{timeLeft.seconds}</span>
          <span className="text-xs text-gray-500 mt-1">שניות</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
