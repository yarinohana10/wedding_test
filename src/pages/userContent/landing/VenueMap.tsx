
import React from 'react';
import { MapPin } from 'lucide-react';

interface VenueMapProps {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const VenueMap: React.FC<VenueMapProps> = ({ 
  address, 
  coordinates 
}) => {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="text-wedding-primary mr-2" size={28} />
            <h2 className="text-3xl font-bold text-wedding-dark">מיקום האירוע</h2>
          </div>
          <p className="text-gray-600 mb-8">{address}</p>
        </div>
        
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <div className="h-80 bg-gray-200 relative">
            <iframe 
              src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen
              loading="lazy"
              title="מפת האירוע"
            ></iframe>
          </div>
          
          <div className="bg-white p-4 flex justify-center space-x-4 space-x-reverse">
            <a 
              href={`https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <img src="https://www.waze.com/favicon.ico" alt="Waze" className="w-5 h-5" />
              <span>נווט עם Waze</span>
            </a>
            
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <img src="https://maps.google.com/favicon.ico" alt="Google Maps" className="w-5 h-5" />
              <span>נווט עם Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueMap;
