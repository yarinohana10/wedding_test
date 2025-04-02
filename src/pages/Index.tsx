import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Countdown from "@/components/landing/Countdown";

import RsvpForm from "@/components/rsvp/RsvpForm";
import { Button } from "@/components/ui/button";
import { Image, Heart, Clock, Calendar, MapPin } from "lucide-react";
import { formatHebrewDate, getDayOfWeek } from "@/lib/date";
import ReactConfetti from "react-confetti";
import GoToGallery from "./userContent/GoToGallery";

export const weddingDate = new Date();
export const coupleName = "דנה & יוסי";
export const targetDate = new Date(weddingDate);
export const colors = [
  "#F0B6BC",
  "#E8D7C3",
  "#D4AF7A",
  "#F9F5F2",
  "#1A1A2E",
  "#FFD1DC",
  "#FFEFD5",
];

export const weddingData = {
  coupleName,
  date: `יום ${getDayOfWeek(targetDate)}, ${formatHebrewDate(targetDate)}`,
  venue: "אולמי הגן הקסום",
  address: "רחוב הפרחים 123, תל אביב",
  time: "19:00",
  targetDate,
  coordinates: {
    lat: 32.0853,
    lng: 34.7818,
  },
  heroImages: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
  ],
};

const Index = () => {
  useEffect(() => {
    document.title = `${coupleName} - הזמנה לחתונה`;
  }, []);

  return (
    <div>
      <ReactConfetti
        recycle={false}
        colors={colors}
        className="w-full h-full"
        numberOfPieces={700}
      />
      <Navbar />
      <HeroSection
        date={weddingData.date}
        coupleName={weddingData.coupleName}
        heroImages={weddingData.heroImages}
      />
      <Countdown targetDate={weddingData.targetDate} />
      <RsvpForm />
      <GoToGallery />
      <Footer />
    </div>
  );
};

export default Index;
