
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Settings } from "lucide-react";

// Import components
import EventDetailsForm from "@/pages/adminContent/adminSection/settings/EventDetailsForm";
import HeroImagesSection from "@/pages/adminContent/adminSection/settings/HeroImagesSection";
import GalleryManager from "@/pages/adminContent/adminSection/settings/GalleryManager";
import MessageTemplates from "@/pages/adminContent/adminSection/settings/MessageTemplates";
import { fetchEventSettings } from "@/services/eventSettingsService";
import { defaultWeddingData } from "@/pages/Index";

const DashboardSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [eventDetails, setEventDetails] = useState({
    coupleName: defaultWeddingData.coupleName,
    date: "",
    time: defaultWeddingData.time,
    venue: defaultWeddingData.venue,
    address: defaultWeddingData.address,
    coordinates: defaultWeddingData.coordinates,
  });

  const [previewHeroImages, setPreviewHeroImages] = useState<string[]>([]);
  const [searchVenue, setSearchVenue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Messages for different events
  const [messages, setMessages] = useState({
    invitation:
      "היי [שם]! אנחנו שמחים להזמין אותך לחתונה שלנו! נא אשר את הגעתך בקישור: [קישור]",
    reminder:
      "היי [שם], רק להזכיר שהחתונה שלנו תתקיים בעוד שבוע! נשמח לראותך שם.",
    dayBefore: "היי [שם], החתונה שלנו מחר! אנחנו מצפים לראותך.",
    eventDay:
      "היי [שם], החתונה שלנו היום! אנחנו מצפים לראותך בשעה [שעה] ב[מיקום].",
    thankYou:
      "היי [שם], תודה שהגעת לחתונה שלנו! היה לנו כיף גדול ושמחנו לחגוג איתך!",
  });

  useEffect(() => {
    // Fetch event settings from Supabase
    const loadEventSettings = async () => {
      try {
        setLoading(true);
        const settings = await fetchEventSettings();
        if (settings) {
          const eventDate = new Date(settings.event_date);
          
          setEventDetails({
            coupleName: settings.couple_name,
            date: eventDate.toISOString().split('T')[0], // Format as YYYY-MM-DD for input
            time: eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            venue: settings.venue,
            address: settings.address,
            coordinates: settings.venue_coordinates,
          });
          
          setPreviewHeroImages(settings.hero_images || []);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "שגיאה בטעינת ההגדרות",
          description: "אירעה שגיאה בעת טעינת הגדרות האירוע",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEventSettings();
  }, [toast]);

  const handleEventDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const searchVenues = () => {
    if (!searchVenue.trim()) return;

    setIsSearching(true);

    // Simulate API call to Google Places
    setTimeout(() => {
      const mockResults = [
        { 
          id: 1, 
          name: "אולמי הגן הקסום", 
          address: "רחוב הפרחים 123, תל אביב",
          coordinates: { lat: 32.0853, lng: 34.7818 },
        },
        { 
          id: 2, 
          name: "אולמי השרון", 
          address: "רחוב הברושים 45, רמת השרון",
          coordinates: { lat: 32.1543, lng: 34.8351 },
        },
        {
          id: 3,
          name: searchVenue + " - מקום אירועים",
          address: "רחוב הזית 78, ירושלים",
          coordinates: { lat: 31.7683, lng: 35.2137 },
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const selectVenue = (venue: any) => {
    setEventDetails((prev) => ({
      ...prev,
      venue: venue.name,
      address: venue.address,
      coordinates: venue.coordinates,
    }));

    setSearchVenue("");
    setSearchResults([]);

    toast({
      title: "מיקום נבחר",
      description: `${venue.name} נבחר בהצלחה`,
    });
  };

  const openPreview = () => {
    window.open("/", "_blank");
  };

  const handleSaveMessage = (messageType: keyof typeof messages) => {
    toast({
      title: "הודעה נשמרה",
      description: "תבנית ההודעה עודכנה בהצלחה",
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">טוען...</div>;
  }

  return (
    <div className="flex flex-col gap-4 text-right">
      <div className="flex justify-between items-center">
        <Button onClick={openPreview} className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 ml-2" />
          <span className={"md:inline"}>תצוגה מקדימה</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">הגדרות</h1>
          <p className="text-muted-foreground">
            עדכון פרטי האירוע, תמונות והודעות
          </p>
        </div>
      </div>

      <Card className="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>הגדרות אירוע</span>
            <Settings className="h-5 w-5 mr-2" />
          </CardTitle>
          <CardDescription>
            עדכן את הפרטים שיוצגו באתר החתונה ובהזמנות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="event-details">
            <TabsList className="mb-4 w-full grid grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="event-details">פרטי האירוע</TabsTrigger>
              <TabsTrigger value="gallery">גלריית תמונות</TabsTrigger>
              <TabsTrigger value="messages">ניהול הודעות</TabsTrigger>
            </TabsList>

            <TabsContent value="event-details" className="space-y-4">
              <EventDetailsForm
                eventDetails={eventDetails}
                setEventDetails={setEventDetails}
                handleEventDetailsChange={handleEventDetailsChange}
                searchVenue={searchVenue}
                setSearchVenue={setSearchVenue}
                searchVenues={searchVenues}
                isSearching={isSearching}
                searchResults={searchResults}
                selectVenue={selectVenue}
              />

              <HeroImagesSection
                previewHeroImages={previewHeroImages}
                setPreviewHeroImages={setPreviewHeroImages}
              />
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <GalleryManager />
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <MessageTemplates
                messages={messages}
                setMessages={setMessages}
                handleSaveMessage={handleSaveMessage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
