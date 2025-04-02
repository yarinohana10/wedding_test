
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, Navigation, Car, Clock, Phone, Mail } from 'lucide-react';
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
  
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google) {
      setGoogleMapsLoaded(true);
      return;
    }
    
    // Load Google Maps API script dynamically
    const googleMapsApiKey = 'REPLACE_WITH_YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&language=he`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    window.initMap = () => {
      setGoogleMapsLoaded(true);
    };
    
    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);
  
  useEffect(() => {
    if (!googleMapsLoaded) return;
    
    const mapElement = document.getElementById('venue-map');
    if (!mapElement) return;
    
    const map = new google.maps.Map(mapElement, {
      center: venueDetails.coordinates,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
    });
    
    const marker = new google.maps.Marker({
      position: venueDetails.coordinates,
      map: map,
      title: venueDetails.name,
      animation: google.maps.Animation.DROP,
    });
    
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="text-right p-2" dir="rtl">
          <h3 class="font-bold text-lg">${venueDetails.name}</h3>
          <p>${venueDetails.address}</p>
        </div>
      `
    });
    
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
    
    // Open info window by default
    infoWindow.open(map, marker);
    
  }, [googleMapsLoaded, venueDetails]);

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
              <div id="venue-map" className="h-80 bg-gray-200 relative"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-right">{venueDetails.name}</h2>
                <p className="text-gray-600 mb-4 text-right">{venueDetails.address}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-right">
                    <h3 className="font-bold mb-2 flex items-center justify-end">
                      <span>פרטי התקשרות</span>
                    </h3>
                    <p className="text-gray-600 mb-1 flex items-center justify-end">
                      <span>{venueDetails.phone}</span>
                      <Phone className="h-4 w-4 text-wedding-primary mr-2" />
                    </p>
                    <p className="text-gray-600 mb-4 flex items-center justify-end">
                      <span>{venueDetails.email}</span>
                      <Mail className="h-4 w-4 text-wedding-primary mr-2" />
                    </p>
                    
                    <h3 className="font-bold mb-2 flex items-center justify-end">
                      <span>שעות פעילות</span>
                      <Clock className="h-4 w-4 text-wedding-primary mr-2" />
                    </h3>
                    <p className="text-gray-600 mb-4 text-right">{venueDetails.hours}</p>
                  </div>
                  
                  <div className="text-right">
                    <h3 className="font-bold mb-2 flex items-center justify-end">
                      <span>חניה</span>
                    </h3>
                    <p className="text-gray-600 mb-4 text-right">{venueDetails.parking}</p>
                    
                    <h3 className="font-bold mb-2 flex items-center justify-end">
                      <span>הוראות הגעה</span>
                    </h3>
                    <div className="flex flex-col gap-3 mt-3">
                      <Button className="flex items-center gap-2" asChild>
                        <a 
                          href={`https://waze.com/ul?ll=${venueDetails.coordinates.lat},${venueDetails.coordinates.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-4 w-4 ml-2" />
                          <span>נווט באמצעות Waze</span>
                        </a>
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2" asChild>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${venueDetails.coordinates.lat},${venueDetails.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Car className="h-4 w-4 ml-2" />
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

// Add a type declaration for Google Maps API
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default Location;
