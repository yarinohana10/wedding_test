
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Navigation, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Location = () => {
  const venueDetails = {
    name: "אולמי הגן הקסום",
    address: "רחוב הפרחים 123, תל אביב",
    phone: "03-1234567",
    email: "info@magic-garden.co.il",
    coordinates: {
      lat: 32.0853,
      lng: 34.7818
    },
    hours: "א'-ה': 10:00-22:00, ו': 10:00-15:00, שבת: סגור",
    parking: "חניון ציבורי צמוד לאולם (חינם לאורחי האירוע)"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-wedding-primary mr-2" size={28} />
                <h1 className="text-3xl md:text-4xl font-bold">מיקום האירוע</h1>
              </div>
              <p className="text-gray-600">כיצד להגיע לאירוע שלנו</p>
            </div>
            
            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
              <div className="h-80 bg-gray-200 relative">
                <iframe 
                  src={`https://maps.google.com/maps?q=${venueDetails.coordinates.lat},${venueDetails.coordinates.lng}&z=15&output=embed`} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy"
                  title="מפת האירוע"
                ></iframe>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{venueDetails.name}</h2>
                <p className="text-gray-600 mb-4">{venueDetails.address}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-2">פרטי התקשרות</h3>
                    <p className="text-gray-600 mb-1">טלפון: {venueDetails.phone}</p>
                    <p className="text-gray-600 mb-4">אימייל: {venueDetails.email}</p>
                    
                    <h3 className="font-bold mb-2">שעות פעילות</h3>
                    <p className="text-gray-600 mb-4">{venueDetails.hours}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">חניה</h3>
                    <p className="text-gray-600 mb-4">{venueDetails.parking}</p>
                    
                    <h3 className="font-bold mb-2">הוראות הגעה</h3>
                    <div className="flex flex-col gap-3 mt-3">
                      <Button className="flex items-center gap-2" asChild>
                        <a 
                          href={`https://waze.com/ul?ll=${venueDetails.coordinates.lat},${venueDetails.coordinates.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-4 w-4" />
                          <span>נווט באמצעות Waze</span>
                        </a>
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2" asChild>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${venueDetails.coordinates.lat},${venueDetails.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Car className="h-4 w-4" />
                          <span>נווט באמצעות Google Maps</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Location;
