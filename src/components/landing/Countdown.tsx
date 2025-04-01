
import React, { useState, useEffect, useRef } from 'react';
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
  
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      // בדיקה אם עברה לפחות שנייה מהעדכון האחרון
      if (time - previousTimeRef.current >= 1000) {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference > 0) {
          // חישוב ימים, שעות, דקות ושניות
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
          // אם תאריך היעד עבר, הגדר את כל הערכים ל-0
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
        }
        
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // חישוב ראשוני של הזמן שנותר
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
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
      }
    };

    calculateTimeLeft();
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
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
