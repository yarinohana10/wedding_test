import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import Countdown from '@/components/landing/Countdown';
import EventDetails from '@/components/landing/EventDetails';
import ConfettiLoader from '@/components/effects/ConfettiLoader';
import RsvpForm from '@/components/rsvp/RsvpForm';
import { Button } from '@/components/ui/button';
import { Image, Heart } from 'lucide-react';

const Index = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowConfetti(true);
    document.title = "דנה & יוסי - הזמנה לחתונה";
  }, []);

  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setMonth(today.getMonth() + 1);
  targetDate.setHours(19, 0, 0, 0);

  const weddingData = {
    coupleName: "דנה & יוסי",
    date: `יום ${getDayOfWeek(targetDate)}, ${formatHebrewDate(targetDate)}`,
    venue: "אולמי הגן הקסום",
    address: "רחוב הפרחים 123, תל אביב",
    time: "19:00",
    targetDate,
    coordinates: {
      lat: 32.0853,
      lng: 34.7818
    },
    heroImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiLoader />}
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection 
          coupleName={weddingData.coupleName}
          date={weddingData.date}
          heroImages={weddingData.heroImages}
        />
        
        <section className="py-16 bg-wedding-light">
          <div className="container mx-auto px-4">
            <Countdown targetDate={weddingData.targetDate} />
          </div>
        </section>
        
        <section id="rsvp-section" className="py-16 gradient-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <EventDetails 
                  venue={weddingData.venue}
                  address={weddingData.address}
                  date={weddingData.date}
                  time={weddingData.time}
                  coordinates={weddingData.coordinates}
                />
              </div>
              
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <RsvpForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-wedding-light text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto bg-white rounded-lg p-8 shadow-md">
              <div className="flex justify-center mb-4">
                <Heart className="text-wedding-primary h-8 w-8 mr-2" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold mb-4">הצטרפו לחגיגה שלנו</h2>
              <p className="text-gray-600 mb-6">
                צפו בתמונות שלנו וחלקו את הרגעים המיוחדים שלכם. אתם מוזמנים להעלות תמונות משלכם!
              </p>
              <Button 
                onClick={() => navigate('/gallery')}
                variant="outline" 
                className="bg-white border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white transition-colors flex items-center gap-3 mx-auto"
              >
                <Image className="h-5 w-5" />
                <span>צפו בגלריה שלנו</span>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

function getDayOfWeek(date: Date): string {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  return days[date.getDay()];
}

function formatHebrewDate(date: Date): string {
  const day = date.getDate();
  const months = [
    "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ב${month} ${year}`;
}

export default Index;
