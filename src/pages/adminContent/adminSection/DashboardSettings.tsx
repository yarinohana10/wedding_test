
import React, { useState } from "react";
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

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "preCeremony" | "ceremony" | "reception";
  featured: boolean;
}

const DashboardSettings = () => {
  const { toast } = useToast();

  const [eventDetails, setEventDetails] = useState({
    coupleName: "דנה & יוסי",
    date: "2024-08-12",
    time: "19:00",
    venue: "אולמי הגן הקסום",
    address: "רחוב הפרחים 123, תל אביב",
  });

  const [heroImages, setHeroImages] = useState<File[]>([]);
  const [previewHeroImages, setPreviewHeroImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
  ]);

  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [searchVenue, setSearchVenue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [existingImages, setExistingImages] = useState<GalleryImage[]>([
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      alt: "תמונה 1",
      category: "preCeremony",
      featured: true,
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
      alt: "תמונה 2",
      category: "ceremony",
      featured: true,
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      alt: "תמונה 3",
      category: "ceremony",
      featured: false,
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1470290378674-419847e9cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80",
      alt: "תמונה 4",
      category: "reception",
      featured: true,
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      alt: "תמונה 5",
      category: "ceremony",
      featured: true,
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      alt: "תמונה 6",
      category: "preCeremony",
      featured: true,
    },
  ]);

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

  const handleEventDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setHeroImages((prev) => [...prev, ...newFiles]);

      // Generate previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewHeroImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: "preCeremony" | "ceremony" | "reception"
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages((prev) => [...prev, ...files]);

      // Create new image objects
      const newImages = files.map((file, index) => ({
        id: Math.max(...existingImages.map((img) => img.id), 0) + index + 1,
        src: URL.createObjectURL(file),
        alt: `תמונה חדשה ${index + 1}`,
        category,
        featured: false,
      }));

      setExistingImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSaveEventDetails = () => {
    toast({
      title: "פרטי האירוע נשמרו",
      description: "הפרטים עודכנו בהצלחה",
    });
  };

  const handleSaveHeroImages = () => {
    if (heroImages.length > 0) {
      toast({
        title: "תמונות הכותרת הועלו",
        description: `${heroImages.length} תמונות הועלו בהצלחה`,
      });
    } else {
      toast({
        title: "שגיאה",
        description: "יש לבחור קובץ תחילה",
        variant: "destructive",
      });
    }
  };

  const toggleImageFeatured = (imageId: number) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, featured: !img.featured } : img
      )
    );

    toast({
      title: "סטטוס תמונה עודכן",
      description: "סטטוס התמונה המודגשת עודכן בהצלחה",
    });
  };

  const deleteImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

    toast({
      title: "תמונה נמחקה",
      description: "התמונה הוסרה מהגלריה בהצלחה",
    });
  };

  const searchVenues = () => {
    if (!searchVenue.trim()) return;

    setIsSearching(true);

    // Simulate API call to Google Places
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: "אולמי הגן הקסום", address: "רחוב הפרחים 123, תל אביב" },
        { id: 2, name: "אולמי השרון", address: "רחוב הברושים 45, רמת השרון" },
        {
          id: 3,
          name: searchVenue + " - מקום אירועים",
          address: "רחוב הזית 78, ירושלים",
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(existingImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExistingImages(items);
  };

  const getImagesByCategory = (
    category: "preCeremony" | "ceremony" | "reception"
  ) => {
    return existingImages.filter((img) => img.category === category);
  };

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

      <Card>
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
                handleEventDetailsChange={handleEventDetailsChange}
                searchVenue={searchVenue}
                setSearchVenue={setSearchVenue}
                searchVenues={searchVenues}
                isSearching={isSearching}
                searchResults={searchResults}
                selectVenue={selectVenue}
                handleSaveEventDetails={handleSaveEventDetails}
              />
              
              <HeroImagesSection 
                previewHeroImages={previewHeroImages}
                handleHeroImagesChange={handleHeroImagesChange}
                handleSaveHeroImages={handleSaveHeroImages}
              />
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <GalleryManager 
                existingImages={existingImages}
                handleGalleryImagesChange={handleGalleryImagesChange}
                toggleImageFeatured={toggleImageFeatured}
                deleteImage={deleteImage}
                onDragEnd={onDragEnd}
                getImagesByCategory={getImagesByCategory}
              />
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
