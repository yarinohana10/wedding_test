
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Save, Upload, Clock, MapPin, Calendar } from "lucide-react";

const DashboardSettings = () => {
  const { toast } = useToast();
  const [eventDetails, setEventDetails] = useState({
    coupleName: "דנה & יוסי",
    date: "2024-08-12",
    time: "19:00",
    venue: "אולמי הגן הקסום",
    address: "רחוב הפרחים 123, תל אביב",
  });

  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const handleEventDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroImage(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const handleSaveEventDetails = () => {
    // In a real app, this would save to a database
    toast({
      title: "פרטי האירוע נשמרו",
      description: "הפרטים עודכנו בהצלחה",
    });
  };

  const handleSaveHeroImage = () => {
    // In a real app, this would upload the image to storage
    if (heroImage) {
      toast({
        title: "תמונת הכותרת הועלתה",
        description: `הקובץ ${heroImage.name} הועלה בהצלחה`,
      });
    } else {
      toast({
        title: "שגיאה",
        description: "יש לבחור קובץ תחילה",
        variant: "destructive",
      });
    }
  };

  const handleSaveGalleryImages = () => {
    // In a real app, this would upload the images to storage
    if (galleryImages.length > 0) {
      toast({
        title: "תמונות הגלריה הועלו",
        description: `${galleryImages.length} תמונות הועלו בהצלחה`,
      });
    } else {
      toast({
        title: "שגיאה",
        description: "יש לבחור קבצים תחילה",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">הגדרות</h1>
        <p className="text-muted-foreground">
          עדכון פרטי האירוע והעלאת תמונות
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>הגדרות אירוע</span>
          </CardTitle>
          <CardDescription>
            עדכן את הפרטים שיוצגו באתר החתונה ובהזמנות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="event-details">
            <TabsList className="mb-4 w-full grid grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="event-details">פרטי האירוע</TabsTrigger>
              <TabsTrigger value="hero-image">תמונת כותרת</TabsTrigger>
              <TabsTrigger value="gallery">גלריית תמונות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="event-details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">שמות החתן והכלה</label>
                  <div className="relative">
                    <Input
                      name="coupleName"
                      value={eventDetails.coupleName}
                      onChange={handleEventDetailsChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">תאריך האירוע</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      name="date"
                      type="date"
                      value={eventDetails.date}
                      onChange={handleEventDetailsChange}
                      className="pr-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">שעת האירוע</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      name="time"
                      type="time"
                      value={eventDetails.time}
                      onChange={handleEventDetailsChange}
                      className="pr-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">שם האולם</label>
                  <Input
                    name="venue"
                    value={eventDetails.venue}
                    onChange={handleEventDetailsChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">כתובת</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      name="address"
                      value={eventDetails.address}
                      onChange={handleEventDetailsChange}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveEventDetails} className="flex items-center gap-2 mt-4">
                <Save className="h-4 w-4" />
                <span>שמור שינויים</span>
              </Button>
            </TabsContent>
            
            <TabsContent value="hero-image" className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">תמונת כותרת ראשית</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  העלה תמונה שתופיע בחלק העליון של דף הבית. מומלץ תמונה באיכות גבוהה ביחס רוחב-גובה של 16:9.
                </p>
                
                <div className="mb-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageChange}
                  />
                </div>
                
                {heroImage && (
                  <div className="mb-4">
                    <p className="text-sm">נבחר: {heroImage.name}</p>
                  </div>
                )}
                
                <Button onClick={handleSaveHeroImage} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>העלה תמונה</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">גלריית תמונות</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  העלה תמונות לגלריה שתוצג בדף הגלריה. ניתן לבחור מספר תמונות בו-זמנית.
                </p>
                
                <div className="mb-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                  />
                </div>
                
                {galleryImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm">נבחרו: {galleryImages.length} תמונות</p>
                  </div>
                )}
                
                <Button onClick={handleSaveGalleryImages} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>העלה תמונות</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
