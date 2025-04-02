import React, { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });


  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const countUnits = [
    {
      label: "ימים",
      value: timeLeft.days,
      color: "bg-wedding-primary text-white",
    },
    {
      label: "שעות",
      value: timeLeft.hours,
      color: "bg-wedding-accent text-white",
    },
    {
      label: "דקות",
      value: timeLeft.minutes,
      color: "bg-wedding-dark text-white",
    },
    {
      label: "שניות",
      value: timeLeft.seconds,
      color: "bg-wedding-light text-wedding-dark",
    },
  ];

  return (
    <div className="text-center py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        הספירה לאחור לאירוע
      </h2>

      <div className="flex flex-row-reverse justify-center items-center gap-3 md:gap-6">
        {countUnits.map((unit, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`${unit.color} rounded-xl shadow-lg p-4 w-20 md:w-28 aspect-square flex items-center justify-center md:text-3xl bg:text-4xl font-bold`}
            >
              {unit.value.toString().padStart(2, "0")}
            </div>
            <p className="mt-2 font-medium text-gray-700">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
