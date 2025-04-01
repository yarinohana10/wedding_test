
import React from 'react';
import { MapPin, Clock, Calendar, Users, Heart, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  // Function to create Google Calendar link
  const createGoogleCalendarLink = () => {
    // Convert event date to ISO format for Google link
    const eventDate = new Date(2024, 7, 12, 19, 0, 0);
    const endDate = new Date(2024, 7, 12, 23, 59, 0);
    
    const startTimeISO = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endTimeISO = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה%20של%20דנה%20ויוסי&dates=${startTimeISO}/${endTimeISO}&details=אנחנו%20מתחתנים!%20נשמח%20לראותכם%20בשמחתנו.&location=${encodeURIComponent(address)}&ctz=Asia/Jerusalem`;
  };

  // Function to create iCal file for download
  const createICalFile = () => {
    const eventDate = new Date(2024, 7, 12, 19, 0, 0);
    const endDate = new Date(2024, 7, 12, 23, 59, 0);
    
    const startTimeISO = eventDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
    const endTimeISO = endDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
    
    const iCalData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Joy//NONSGML v1.0//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Jerusalem:${startTimeISO}`,
      `DTEND;TZID=Asia/Jerusalem:${endTimeISO}`,
      `SUMMARY:חתונה של דנה ויוסי`,
      `DESCRIPTION:אנחנו מתחתנים! נשמח לראותכם בשמחתנו.`,
      `LOCATION:${address}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'DESCRIPTION:התראה לפני האירוע',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([iCalData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding-invitation.ics');
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md max-w-4xl mx-auto overflow-hidden">
      <div className="flex items-center justify-center mb-8">
        <Heart className="text-wedding-primary mr-2" size={28} fill="currentColor" />
        <h2 className="text-2xl md:text-3xl font-bold text-wedding-dark">פרטי האירוע</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <MapPin className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <p className="font-bold text-lg text-wedding-dark">{venue}</p>
              <p className="text-gray-600">{address}</p>
            </div>
          </div>
          
          <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <Calendar className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <p className="font-bold text-lg text-wedding-dark">תאריך האירוע</p>
              <p className="text-gray-600 mb-3">{date}</p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white transition-colors flex items-center gap-2"
                  onClick={() => window.open(createGoogleCalendarLink(), '_blank')}
                >
                  <img src="https://www.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png" 
                       alt="Google Calendar" 
                       className="w-5 h-5 ml-1" />
                  <span>הוסף ליומן Google</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white transition-colors flex items-center gap-2"
                  onClick={createICalFile}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/iOS_Calendar_Icon.png" 
                       alt="iCal" 
                       className="w-5 h-5 ml-1" />
                  <span>הורד ל-iCal</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
            <Clock className="text-wedding-primary mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <p className="font-bold text-lg text-wedding-dark">שעה</p>
              <div className="flex flex-col">
                <p className="text-gray-600">קבלת פנים: {time}</p>
                <p className="text-gray-600">חופה: 20:00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg h-full">
          <div className="h-80 bg-gray-200 relative">
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
              <img src="https://www.waze.com/favicon.ico" alt="Waze" className="w-5 h-5" />
              <span>נווט עם Waze</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-100"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`, '_blank')}
            >
              <img src="https://maps.google.com/favicon.ico" alt="Google Maps" className="w-5 h-5" />
              <span>נווט עם Google Maps</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
