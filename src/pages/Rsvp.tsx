
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RsvpForm from '@/components/rsvp/RsvpForm';

const Rsvp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <RsvpForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rsvp;
