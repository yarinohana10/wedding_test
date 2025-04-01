
import React from 'react';
import { MapPin, Clock, Calendar, Users, Heart, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EventDetailsProps {
  venue: string;
  address: string;
  date: string;
  time: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const EventDetails: React.FC<EventDetailsProps> = ({ 
  venue, 
  address, 
  date, 
  time,
  coordinates
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md max-w-4xl mx-auto overflow-hidden">
      <div className="flex items-center justify-center mb-6">
        <Heart className="text-wedding-primary mr-2" size={24} />
        <h2 className="text-2xl font-bold text-wedding-dark">פרטי האירוע</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-start p-4 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <MapPin className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={22} />
            <div>
              <p className="font-bold text-wedding-dark">{venue}</p>
              <p className="text-gray-600 text-sm">{address}</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <Calendar className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={22} />
            <div>
              <p className="font-bold text-wedding-dark">תאריך האירוע</p>
              <p className="text-gray-600">{date}</p>
              <div className="mt-2">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה&dates=20240812T190000/20240812T235900&details=אנחנו מתחתנים! נשמח לראותכם בשמחתנו.&location=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                >
                  <span>הוסף ליומן</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <Clock className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={22} />
            <div>
              <p className="font-bold text-wedding-dark">שעה</p>
              <div className="flex flex-col">
                <p className="text-gray-600">קבלת פנים: {time}</p>
                <p className="text-gray-600">חופה: 20:00</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <Users className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={22} />
            <div>
              <p className="font-bold text-wedding-dark">אישור הגעה</p>
              <p className="text-gray-600 text-sm">נשמח לראותכם! אנא אשרו הגעה</p>
              <div className="mt-2">
                <Button asChild className="bg-wedding-primary hover:bg-wedding-accent text-white">
                  <Link to="/rsvp">אישור הגעה</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-md">
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
          
          <div className="bg-gray-50 p-4 flex justify-center space-x-4 space-x-reverse">
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
    </div>
  );
};

export default EventDetails;
