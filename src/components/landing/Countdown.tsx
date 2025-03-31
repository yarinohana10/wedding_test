
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
    // Function to calculate time difference
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        // Calculate days, hours, minutes and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        // If the target date has passed, set all values to 0
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update the countdown every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
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
