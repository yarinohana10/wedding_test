import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin } from "lucide-react";
import { formatHebrewDate, getDayOfWeek } from "@/lib/date";

export const weddingDate = new Date();
export const coupleName = "דנה & יוסי";
export const targetDate = new Date(weddingDate);
export const colors = [
  "#F0B6BC",
  "#E8D7C3",
  "#D4AF7A",
  "#F9F5F2",
  "#1A1A2E",
  "#FFD1DC",
  "#FFEFD5",
];

export const weddingData = {
  coupleName,
  date: `יום ${getDayOfWeek(targetDate)}, ${formatHebrewDate(targetDate)}`,
  venue: "אולמי הגן הקסום",
  address: "רחוב הפרחים 123, תל אביב",
  time: "19:00",
  targetDate,
  coordinates: {
    lat: 32.0853,
    lng: 34.7818,
  },
  heroImages: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
  ],
};

const WeddingInfo = () => {
  return (
    <div>
      <div className="flex items-center gap-3 items-start p-5 my-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
        <MapPin className="text-wedding-primary" size={33} />
        <div>
          <p className="font-bold text-lg text-wedding-dark">
            {weddingData.venue}
          </p>
          <p className="text-gray-600">{weddingData.address}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 items-start p-5 my-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
        <Calendar className="text-wedding-primary" size={33} />
        <div>
          <p className="font-bold text-lg text-wedding-dark">תאריך האירוע</p>
          <p className="text-gray-600 mb-3">{weddingData.date}</p>
        </div>
        <Button
          className="bg-wedding-primary text-white hover:bg-wedding-accent transition-colors"
          onClick={() => {
            const eventDate = new Date();
            eventDate.setMonth(eventDate.getMonth() + 1);
            eventDate.setHours(19, 0, 0, 0);

            const endDate = new Date(eventDate);
            endDate.setHours(23, 59, 0);

            const startTimeISO = eventDate
              .toISOString()
              .replace(/-|:|\.\d+/g, "");
            const endTimeISO = endDate.toISOString().replace(/-|:|\.\d+/g, "");

            const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה%20של%20דנה%20ויוסי&dates=${startTimeISO}/${endTimeISO}&details=אנחנו%20מתחתנים!%20נשמח%20לראותכם%20בשמחתנו.&location=${encodeURIComponent(
              weddingData.address
            )}&ctz=Asia/Jerusalem`;

            window.open(calendarLink, "_blank");
          }}
        >
          הוסף ליומן
        </Button>
      </div>

      <div className="flex items-center gap-3 items-start p-5 my-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
        <Clock className="text-wedding-primary" size={33} />
        <div>
          <p className="font-bold text-lg text-wedding-dark">שעה</p>
          <div className="flex flex-col">
            <p className="text-gray-600">קבלת פנים: {weddingData.time}</p>
            <p className="text-gray-600">חופה: 20:00</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-lg h-48 md:h-64 transition-transform hover:scale-[1.02]">
        <iframe
          src={`https://maps.google.com/maps?q=${weddingData.coordinates.lat},${weddingData.coordinates.lng}&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="מפת האירוע"
          className="w-full h-full"
        />
      </div>
      <div className="flex my-4 gap-4 w-full flex-wrap">
        <Button
          type="submit"
          className="w-full bg-wedding-accent hover:bg-gray-400 text-white min-w-40 py-6 text-lg"
          onClick={() =>
            window.open(
              `https://waze.com/ul?ll=${weddingData.coordinates.lat},${weddingData.coordinates.lng}&navigate=yes`,
              "_blank"
            )
          }
        >
          <span>נווט עם Waze</span>
          <img
            src="https://www.waze.com/favicon.ico"
            alt="Waze"
            className="w-5 h-5"
          />
        </Button>
        <Button
          type="submit"
          className="w-full bg-wedding-accent hover:bg-gray-400 text-white min-w-40 py-6 text-lg"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${weddingData.coordinates.lat},${weddingData.coordinates.lng}`,
              "_blank"
            )
          }
        >
          <span>נווט עם Google Maps</span>
          <img
            src="https://maps.google.com/favicon.ico"
            alt="Google Maps"
            className="w-5 h-5"
          />
        </Button>
      </div>
    </div>
  );
};

export default WeddingInfo;
