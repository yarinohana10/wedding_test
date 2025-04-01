import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings, 
  Save, 
  Upload, 
  Clock, 
  MapPin, 
  Calendar, 
  ExternalLink,
  Heart,
  Images,
  Locate
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import VenueSelector from "@/components/settings/VenueSelector";

const DashboardSettings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [eventDetails, setEventDetails] = useState({
    coupleName: "דנה & יוסי",
    date: "2024-08-12",
    time: "19:00",
    venue: "אולמי הגן הקסום",
    address: "רחוב הפרחים 123, תל אביב",
    lat: "32.0853",
    lng: "34.7818",
  });

  const [heroImage, setHeroImage] = useState<File | null>(null);
  
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  
  const [existingImages, setExistingImages] = useState([
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 1", category: "preCeremony", featured: true },
    { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "תמונה 2", category: "ceremony", featured: true },
    { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 3", category: "ceremony", featured: false },
    { id: 4, src: "https://images.unsplash.com/photo-1470290378674-419847e9cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "תמונה 4", category: "reception", featured: true },
    { id: 5, src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 5", category: "ceremony", featured: true },
    { id: 6, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 6", category: "preCeremony", featured: true },
  ]);

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
      
      const newImagesArray = [...galleryImages].map((file, index) => ({
        id: existingImages.length + index + 1,
        src: URL.createObjectURL(file),
        alt: `תמונה חדשה ${index + 1}`,
        category: "preCeremony",
        featured: false
      }));
      
      setExistingImages(prev => [...prev, ...newImagesArray]);
      setGalleryImages([]);
    } else {
      toast({
        title: "שגיאה",
        description: "יש לבחור קבצים תחילה",
        variant: "destructive",
      });
    }
  };

  const toggleImageFeatured = (imageId: number) => {
    setExistingImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, featured: !img.featured } 
          : img
      )
    );
    
    toast({
      title: "סטטוס תמונה עודכן",
      description: "סטטוס התמונה המודגשת עודכן בהצלחה",
    });
  };

  const updateImageCategory = (imageId: number, category: string) => {
    setExistingImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, category } 
          : img
      )
    );
    
    toast({
      title: "קטגוריה עודכנה",
      description: "קטגוריית התמונה עודכנה בהצלחה",
    });
  };

  const deleteImage = (imageId: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    
    toast({
      title: "תמונה נמחקה",
      description: "התמונה הוסרה מהגלריה בהצלחה",
    });
  };

  const openPreview = () => {
    window.open('/', '_blank');
  };

  const handleVenueSelected = (venueData: { name: string; address: string; lat: number; lng: number }) => {
    setEventDetails(prev => ({
      ...prev,
      venue: venueData.name,
      address: venueData.address,
      lat: venueData.lat.toString(),
      lng: venueData.lng.toString()
    }));
    
    toast({
      title: "מיקום נבחר",
      description: `${venueData.name} נבחר בהצלחה`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">הגדרות</h1>
          <p className="text-muted-foreground">
            עדכון פרטי האירוע והעלאת תמונות
          </p>
        </div>
        <Button onClick={openPreview} className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          <span className={isMobile ? "" : "inline"}>תצוגה מקדימה</span>
        </Button>
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
                  <label className="text-sm font-medium">שע�� האירוע</label>
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
              </div>
              
              <div className="space-y-4 border p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>מיקום האירוע</span>
                </h3>
                
                <VenueSelector onVenueSelected={handleVenueSelected} />
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">שם האולם</label>
                    <Input
                      name="venue"
                      value={eventDetails.venue}
                      onChange={handleEventDetailsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">קו רוחב (Latitude)</label>
                    <Input
                      name="lat"
                      value={eventDetails.lat}
                      onChange={handleEventDetailsChange}
                      placeholder="32.0853"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">קו אורך (Longitude)</label>
                    <Input
                      name="lng"
                      value={eventDetails.lng}
                      onChange={handleEventDetailsChange}
                      placeholder="34.7818"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 justify-between">
                <Button onClick={handleSaveEventDetails} className="flex items-center gap-2 mt-4">
                  <Save className="h-4 w-4" />
                  <span>שמור שינויים</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={openPreview} 
                  className="flex items-center gap-2 mt-4"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>צפה בדף הבית</span>
                </Button>
              </div>
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
                
                <div className="flex items-center gap-4">
                  <Button onClick={handleSaveHeroImage} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>העלה תמונה</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={openPreview} 
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>צפה בדף הבית</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Images className="h-5 w-5" />
                  <span>ניהול גלריית תמונות</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  העלה תמונות לגלריה וארגן אותן לפי קטגוריות: לפני האירוע, חופה, או רחבת ריקודים.
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
                
                <div className="flex items-center gap-4 mb-8">
                  <Button onClick={handleSaveGalleryImages} className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>העלה תמונות</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/gallery', '_blank')} 
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>צפה בגלריה</span>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-2">ניהול תמונות קיימות</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    סמן תמונות כמודגשות כדי שיופיעו בקרוסלות בדף הגלריה, וארגן אותן לפי קטגוריות.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {existingImages.map(image => (
                      <div key={image.id} className="border rounded-md p-3 flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-24 h-24 flex-shrink-0">
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium">{image.alt}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => deleteImage(image.id)}
                            >
                              <span className="sr-only">מחק</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                              >
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <select
                              className="text-xs border rounded px-2 py-1"
                              value={image.category}
                              onChange={(e) => updateImageCategory(image.id, e.target.value)}
                            >
                              <option value="preCeremony">לפני האירוע</option>
                              <option value="ceremony">חופה</option>
                              <option value="reception">רחבת ריקודים</option>
                            </select>
                            
                            <Button
                              variant={image.featured ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-7 px-2"
                              onClick={() => toggleImageFeatured(image.id)}
                            >
                              <Heart className="h-3 w-3 mr-1" fill={image.featured ? "currentColor" : "none"} />
                              <span>{image.featured ? "מודגשת" : "לא מודגשת"}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
