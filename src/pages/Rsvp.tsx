
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { RsvpForm } from '@/components/rsvp/RsvpForm';

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
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">אישור הגעה</h1>
              <p className="text-gray-600">נשמח לראותכם בשמחתנו!</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="overflow-hidden border-none shadow-md h-full">
                  <CardContent className="p-0">
                    <div className="bg-wedding-primary/10 p-6">
                      <h2 className="text-2xl font-bold mb-4 text-wedding-primary">פרטי האירוע</h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 justify-end">
                          <div>
                            <h3 className="font-medium">{eventDetails.venue}</h3>
                            <p className="text-sm text-gray-600">{eventDetails.address}</p>
                          </div>
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <MapPin className="h-5 w-5 text-wedding-primary" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 justify-end">
                          <div>
                            <h3 className="font-medium">{eventDetails.date}</h3>
                            <p className="text-sm text-gray-600">תאריך האירוע</p>
                          </div>
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Calendar className="h-5 w-5 text-wedding-primary" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 justify-end">
                          <div>
                            <h3 className="font-medium">{eventDetails.time}</h3>
                            <p className="text-sm text-gray-600">שעת קבלת פנים</p>
                          </div>
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Clock className="h-5 w-5 text-wedding-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">אנא מלאו את הפרטים</h2>
                    <RsvpForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rsvp;
