
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import Countdown from '@/components/landing/Countdown';
import EventDetails from '@/components/landing/EventDetails';
import ConfettiLoader from '@/components/effects/ConfettiLoader';

const Index = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // הצג את הקונפטי רק אחרי שהדף נטען לגמרי
    setShowConfetti(true);
    
    // טיפול בתגי כותרת עבור SEO
    document.title = "דנה & יוסי - הזמנה לחתונה";
  }, []);

  // נתוני החתונה לדוגמא - בפרויקט אמיתי נקבל זאת מהבקאנד
  const weddingData = {
    coupleName: "דנה & יוסי",
    date: "יום רביעי, 12 באוגוסט 2024",
    venue: "אולמי הגן הקסום",
    address: "רחוב הפרחים 123, תל אביב",
    time: "19:00",
    // התאריך נקבע ל-12 באוגוסט, 2024 בשעה 19:00 בשעון ישראל
    targetDate: new Date(2024, 7, 12, 19, 0, 0),
    coordinates: {
      lat: 32.0853,
      lng: 34.7818
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiLoader />}
      <Navbar />
      
      {/* תוכן ראשי */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection 
          coupleName={weddingData.coupleName}
          date={weddingData.date}
        />
        
        {/* Countdown Section */}
        <section className="py-16 bg-wedding-light">
          <div className="container mx-auto px-4">
            <Countdown targetDate={weddingData.targetDate} />
          </div>
        </section>
        
        {/* Event Details Section with Map */}
        <section className="py-16 gradient-bg">
          <div className="container mx-auto px-4">
            <EventDetails 
              venue={weddingData.venue}
              address={weddingData.address}
              date={weddingData.date}
              time={weddingData.time}
              coordinates={weddingData.coordinates}
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
