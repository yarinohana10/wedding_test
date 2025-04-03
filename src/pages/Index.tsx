import { useEffect } from "react";
import Navbar from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import HeroSection from "@/pages/userContent/landing/HeroSection";
import Countdown from "@/pages/userContent/landing/Countdown";
import Rsvp from "@/pages/userContent/rsvp/Rsvp";
import { formatHebrewDate, getDayOfWeek } from "@/lib/date";
import ReactConfetti from "react-confetti";
import GoToGallery from "./userContent/GoToGallery";

export const targetDate = new Date();
export const colors = [
  "#F0B6BC",
  "#E8D7C3",
  "#D4AF7A",
  "#F9F5F2",
  "#1A1A2E",
  "#FFD1DC",
  "#FFEFD5",
];

export interface WeddingData {
  date: string;
  time: string;
  venue: string;
  address: string;
  targetDate: Date;
  coupleName: string;
  heroImages: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const weddingData: WeddingData = {
  coupleName: "דנה & יוסי",
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
    document.title = `${weddingData.coupleName} - הזמנה לחתונה`;
  }, []);

  return (
    <div>
      <ReactConfetti
        recycle={false}
        colors={colors}
        numberOfPieces={700}
        className="w-full h-full"
      />
      <Navbar />
      <HeroSection
        date={weddingData.date}
        coupleName={weddingData.coupleName}
        heroImages={weddingData.heroImages}
      />
      <Countdown targetDate={weddingData.targetDate} />
      <Rsvp weddingData={weddingData} />
      <GoToGallery />
      <Footer />
    </div>
  );
};

export default Index;
