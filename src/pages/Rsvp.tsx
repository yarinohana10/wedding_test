
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventDetailsWithRSVP from '@/components/landing/EventDetailsWithRSVP';

const Rsvp = () => {
  // Event details
  const eventDetails = {
    venue: "אולמי הדקל",
    address: "רחוב הדקל 123, רמת גן",
    date: "10 ביוני 2023",
    time: "19:00",
    coordinates: {
      lat: 32.084041,
      lng: 34.797259
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg text-right">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <EventDetailsWithRSVP {...eventDetails} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rsvp;
