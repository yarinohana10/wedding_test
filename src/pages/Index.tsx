import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Countdown from "@/components/landing/Countdown";
import EventDetails from "@/components/landing/EventDetails";
import ConfettiLoader from "@/components/effects/ConfettiLoader";
import RsvpForm from "@/components/rsvp/RsvpForm";
import { Button } from "@/components/ui/button";
import { Image, Heart, Clock, Calendar, MapPin } from "lucide-react";
import { formatHebrewDate, getDayOfWeek } from "@/lib/date";

export const weddingDate = new Date();
export const coupleName = "דנה & יוסי";
export const targetDate = new Date(weddingDate);

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

const Index = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    document.title = `${coupleName} - הזמנה לחתונה`;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiLoader />}
      <Navbar />

      <main className="flex-grow">
        <HeroSection
          coupleName={weddingData.coupleName}
          date={weddingData.date}
          heroImages={weddingData.heroImages}
        />
          <Countdown targetDate={weddingData.targetDate} />

        <section id="rsvp-section" className="py-16 gradient-bg">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl p-6 shadow-md overflow-hidden max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="flex items-center justify-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-wedding-dark">
                      פרטי האירוע
                    </h2>
                    <Heart
                      className="text-wedding-primary mr-2"
                      size={28}
                      fill="currentColor"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
                      <div>
                        <p className="font-bold text-lg text-wedding-dark">
                          {weddingData.venue}
                        </p>
                        <p className="text-gray-600">{weddingData.address}</p>
                      </div>
                      <MapPin
                        className="text-wedding-primary mr-3 mt-1 flex-shrink-0"
                        size={24}
                      />
                    </div>

                    <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
                      <div>
                        <p className="font-bold text-lg text-wedding-dark">
                          תאריך האירוע
                        </p>
                        <p className="text-gray-600 mb-3">{weddingData.date}</p>
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
                            const endTimeISO = endDate
                              .toISOString()
                              .replace(/-|:|\.\d+/g, "");

                            const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה%20של%20דנה%20ויוסי&dates=${startTimeISO}/${endTimeISO}&details=אנחנו%20מתחתנים!%20נשמח%20לראותכם%20בשמחתנו.&location=${encodeURIComponent(
                              weddingData.address
                            )}&ctz=Asia/Jerusalem`;

                            window.open(calendarLink, "_blank");
                          }}
                        >
                          <span>הוסף ליומן</span>
                        </Button>
                      </div>
                      <Calendar
                        className="text-wedding-primary mr-3 mt-1 flex-shrink-0"
                        size={24}
                      />
                    </div>

                    <div className="flex items-start p-5 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]">
                      <div>
                        <p className="font-bold text-lg text-wedding-dark">
                          שעה
                        </p>
                        <div className="flex flex-col">
                          <p className="text-gray-600">
                            קבלת פנים: {weddingData.time}
                          </p>
                          <p className="text-gray-600">חופה: 20:00</p>
                        </div>
                      </div>
                      <Clock
                        className="text-wedding-primary mr-3 mt-1 flex-shrink-0"
                        size={24}
                      />
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-lg h-48 md:h-64">
                      <iframe
                        src={`https://maps.google.com/maps?q=${weddingData.coordinates.lat},${weddingData.coordinates.lng}&z=15&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="מפת האירוע"
                        className="w-full h-full"
                      ></iframe>
                    </div>

                    <div className="flex justify-center space-x-4 space-x-reverse">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-100"
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
                          className="w-5 h-5 mr-1"
                        />
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-100"
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
                          className="w-5 h-5 mr-1"
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <RsvpForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-wedding-light text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto bg-white rounded-lg p-8 shadow-md">
              <div className="flex justify-center mb-4">
                <Heart
                  className="text-wedding-primary ml-2"
                  fill="currentColor"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4">הצטרפו לחגיגה שלנו</h2>
              <p className="text-gray-600 mb-6">
                צפו בתמונות שלנו וחלקו את הרגעים המיוחדים שלכם. אתם מוזמנים
                להעלות תמונות משלכם!
              </p>
              <Button
                onClick={() => navigate("/gallery")}
                variant="outline"
                className="bg-white border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white transition-colors flex items-center gap-3 mx-auto"
              >
                <Image className="h-5 w-5 ml-2" />
                <span>צפו בגלריה שלנו</span>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
