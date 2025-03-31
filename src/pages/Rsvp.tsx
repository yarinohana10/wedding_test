
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
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">אישור הגעה</h1>
              <p className="text-gray-600">נשמח לראותכם באירוע שלנו!</p>
            </div>
            
            <RsvpForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rsvp;
