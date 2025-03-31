
import React from 'react';
import { MapPin, Clock, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EventDetailsProps {
  venue: string;
  address: string;
  date: string;
  time: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ 
  venue, 
  address, 
  date, 
  time 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-wedding-dark">פרטי האירוע</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <MapPin className="text-wedding-primary mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-wedding-dark">{venue}</p>
            <p className="text-gray-600 text-sm">{address}</p>
            <div className="mt-2">
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center"
              >
                <span>נווט ב-Waze</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="text-wedding-primary mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-wedding-dark">תאריך האירוע</p>
            <p className="text-gray-600">{date}</p>
            <div className="mt-2">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה&dates=20231231T190000/20231231T235900&details=אנחנו מתחתנים! נשמח לראותכם בשמחתנו.&location=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center"
              >
                <span>הוסף ליומן</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="text-wedding-primary mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-wedding-dark">שעה</p>
            <div className="flex flex-col">
              <p className="text-gray-600">קבלת פנים: {time}</p>
              <p className="text-gray-600">חופה: 20:00</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Users className="text-wedding-primary mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-wedding-dark">אישור הגעה</p>
            <p className="text-gray-600 text-sm">נשמח לראותכם! אנא אשרו הגעה</p>
            <div className="mt-2">
              <Button asChild className="bg-wedding-primary hover:bg-wedding-accent text-white">
                <Link to="/rsvp">אישור הגעה</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
