
import React from 'react';
import { MapPin, Clock, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Function to create Google Calendar link
  const createGoogleCalendarLink = () => {
    // Convert event date to ISO format for Google link
    const eventDate = new Date();
    eventDate.setMonth(eventDate.getMonth() + 1); // One month from now
    eventDate.setHours(19, 0, 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(23, 59, 0);
    
    const startTimeISO = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endTimeISO = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה%20של%20דנה%20ויוסי&dates=${startTimeISO}/${endTimeISO}&details=אנחנו%20מתחתנים!%20נשמח%20לראותכם%20בשמחתנו.&location=${encodeURIComponent(address)}&ctz=Asia/Jerusalem`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mx-auto overflow-hidden">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-wedding-dark">פרטי האירוע</h2>
        <Heart className="text-wedding-primary mr-2" size={28} fill="currentColor" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="space-y-6 md:w-1/2">
          <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <div>
              <p className="font-bold text-lg text-wedding-dark">{venue}</p>
              <p className="text-gray-600">{address}</p>
            </div>
            <MapPin className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={24} />
          </div>
          
          <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <div>
              <p className="font-bold text-lg text-wedding-dark">תאריך האירוע</p>
              <p className="text-gray-600 mb-3">{date}</p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-wedding-primary text-white hover:bg-wedding-accent transition-colors"
                  onClick={() => window.open(createGoogleCalendarLink(), '_blank')}
                >
                  <span className="ml-2">הוסף ליומן</span>
                </Button>
              </div>
            </div>
            <Calendar className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={24} />
          </div>
          
          <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <div>
              <p className="font-bold text-lg text-wedding-dark">שעה</p>
              <div className="flex flex-col">
                <p className="text-gray-600">קבלת פנים: {time}</p>
                <p className="text-gray-600">חופה: 20:00</p>
              </div>
            </div>
            <Clock className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={24} />
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg md:w-1/2 h-full mt-6 md:mt-0">
          <div className={`${isMobile ? 'h-64' : 'h-80'} bg-gray-200 relative`}>
            <iframe 
              src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen
              loading="lazy"
              title="מפת האירוע"
              className="w-full h-full"
            ></iframe>
          </div>
          
          <div className="bg-gray-50 p-4 flex justify-center space-x-4 space-x-reverse">
            <Button 
              variant="outline"
              className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-100"
              onClick={() => window.open(`https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`, '_blank')}
            >
              <span>נווט עם Waze</span>
              <img src="https://www.waze.com/favicon.ico" alt="Waze" className="w-5 h-5 mr-1" />
            </Button>
            
            <Button 
              variant="outline"
              className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-100"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`, '_blank')}
            >
              <span>נווט עם Google Maps</span>
              <img src="https://maps.google.com/favicon.ico" alt="Google Maps" className="w-5 h-5 mr-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
