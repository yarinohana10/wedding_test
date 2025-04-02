
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  Search,
  MessageSquare
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "preCeremony" | "ceremony" | "reception";
  featured: boolean;
}

const DashboardSettings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 1", category: "preCeremony", featured: true },
    { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "תמונה 2", category: "ceremony", featured: true },
    { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 3", category: "ceremony", featured: false },
    { id: 4, src: "https://images.unsplash.com/photo-1470290378674-419847e9cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "תמונה 4", category: "reception", featured: true },
    { id: 5, src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 5", category: "ceremony", featured: true },
    { id: 6, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "תמונה 6", category: "preCeremony", featured: true },
  ]);

  // Messages for different events
  const [messages, setMessages] = useState({
    invitation: "היי [שם]! אנחנו שמחים להזמין אותך לחתונה שלנו! נא אשר את הגעתך בקישור: [קישור]",
    reminder: "היי [שם], רק להזכיר שהחתונה שלנו תתקיים בעוד שבוע! נשמח לראותך שם.",
    dayBefore: "היי [שם], החתונה שלנו מחר! אנחנו מצפים לראותך.",
    eventDay: "היי [שם], החתונה שלנו היום! אנחנו מצפים לראותך בשעה [שעה] ב[מיקום].",
    thankYou: "היי [שם], תודה שהגעת לחתונה שלנו! היה לנו כיף גדול ושמחנו לחגוג איתך!"
  });

  const handleEventDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleHeroImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setHeroImages(prev => [...prev, ...newFiles]);
      
      // Generate previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewHeroImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>, category: "preCeremony" | "ceremony" | "reception") => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages(prev => [...prev, ...files]);
      
      // Create new image objects
      const newImages = files.map((file, index) => ({
        id: Math.max(...existingImages.map(img => img.id), 0) + index + 1,
        src: URL.createObjectURL(file),
        alt: `תמונה חדשה ${index + 1}`,
        category,
        featured: false
      }));
      
      setExistingImages(prev => [...prev, ...newImages]);
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

  const updateImageCategory = (imageId: number, category: "preCeremony" | "ceremony" | "reception") => {
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

  const searchVenues = () => {
    if (!searchVenue.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call to Google Places
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: "אולמי הגן הקסום", address: "רחוב הפרחים 123, תל אביב" },
        { id: 2, name: "אולמי השרון", address: "רחוב הברושים 45, רמת השרון" },
        { id: 3, name: searchVenue + " - מקום אירועים", address: "רחוב הזית 78, ירושלים" },
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const selectVenue = (venue: any) => {
    setEventDetails(prev => ({
      ...prev,
      venue: venue.name,
      address: venue.address
    }));
    
    setSearchVenue("");
    setSearchResults([]);
    
    toast({
      title: "מיקום נבחר",
      description: `${venue.name} נבחר בהצלחה`,
    });
  };

  const openPreview = () => {
    window.open('/', '_blank');
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

  const getImagesByCategory = (category: "preCeremony" | "ceremony" | "reception") => {
    return existingImages.filter(img => img.category === category);
  };

  return (
    <div className="flex flex-col gap-4 text-right">
      <div className="flex justify-between items-center">
        <Button onClick={openPreview} className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 ml-2" />
          <span className={isMobile ? "" : "inline"}>תצוגה מקדימה</span>
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
              </div>
              
              <div className="space-y-4 border p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span>מיקום האירוע</span>
                  <MapPin className="h-4 w-4 mr-2" />
                </h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="חפש מקום אירוע..."
                        value={searchVenue}
                        onChange={(e) => setSearchVenue(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        onClick={searchVenues}
                        disabled={isSearching}
                        className="flex-shrink-0"
                      >
                        <Search className="h-4 w-4 ml-2" />
                        <span>חפש</span>
                      </Button>
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 right-0 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                        {searchResults.map((venue) => (
                          <div 
                            key={venue.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                            onClick={() => selectVenue(venue)}
                          >
                            <div className="font-medium">{venue.name}</div>
                            <div className="text-sm text-gray-500">{venue.address}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
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
                  </div>
                </div>
              </div>
              
              {/* Hero Images Section */}
              <div className="space-y-4 border p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span>תמונות כותרת ראשית</span>
                  <Images className="h-4 w-4 mr-2" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  העלה תמונות שיופיעו בקרוסלה בחלק העליון של דף הבית. מומלץ תמונות באיכות גבוהה ביחס רוחב-גובה של 16:9.
                </p>
                
                <div className="mb-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHeroImagesChange}
                  />
                </div>
                
                {previewHeroImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {previewHeroImages.map((src, index) => (
                      <div key={index} className="aspect-video relative rounded-md overflow-hidden">
                        <img src={src} alt={`תמונה ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                
                <Button onClick={handleSaveHeroImages} className="flex items-center gap-2">
                  <Upload className="h-4 w-4 ml-2" />
                  <span>העלה תמונות</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 justify-between">
                <Button onClick={handleSaveEventDetails} className="flex items-center gap-2 mt-4">
                  <Save className="h-4 w-4 ml-2" />
                  <span>שמור שינויים</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span>ניהול גלריית תמונות</span>
                  <Images className="h-5 w-5 mr-2" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  העלה תמונות לגלריה וארגן אותן לפי קטגוריות. גרור תמונות לסידור מחדש וסמן עם לב כדי שיופיעו בקרוסלה.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {/* Pre-Ceremony Category */}
                  <div className="border p-3 rounded-lg">
                    <h4 className="font-medium mb-3 text-center">לפני האירוע</h4>
                    <div className="flex justify-center mb-3">
                      <label 
                        htmlFor="pre-ceremony-upload" 
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>העלאת תמונות</span>
                      </label>
                      <input 
                        id="pre-ceremony-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGalleryImagesChange(e, "preCeremony")}
                        className="hidden"
                      />
                    </div>
                    
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="preCeremony">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 min-h-[200px]"
                          >
                            {getImagesByCategory("preCeremony").map((image, index) => (
                              <Draggable key={image.id} draggableId={`pre-${image.id}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex bg-white p-2 rounded-md border shadow-sm"
                                  >
                                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col mr-2 text-right">
                                      <div className="text-sm truncate">{image.alt}</div>
                                      <div className="flex gap-2 mt-auto">
                                        <Button 
                                          onClick={() => toggleImageFeatured(image.id)}
                                          variant={image.featured ? "default" : "outline"}
                                          size="sm"
                                          className="h-7 px-1 flex-1"
                                        >
                                          <Heart className="h-3 w-3 ml-1" fill={image.featured ? "currentColor" : "none"} />
                                          {image.featured ? "מודגשת" : "לא מודגשת"}
                                        </Button>
                                        <Button 
                                          onClick={() => deleteImage(image.id)}
                                          variant="outline"
                                          size="sm"
                                          className="h-7 w-7 p-0 text-destructive"
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
                                            className="h-4 w-4"
                                          >
                                            <path d="M18 6L6 18M6 6l12 12" />
                                          </svg>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                  
                  {/* Ceremony Category */}
                  <div className="border p-3 rounded-lg">
                    <h4 className="font-medium mb-3 text-center">חופה</h4>
                    <div className="flex justify-center mb-3">
                      <label 
                        htmlFor="ceremony-upload" 
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>העלאת תמונות</span>
                      </label>
                      <input 
                        id="ceremony-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGalleryImagesChange(e, "ceremony")}
                        className="hidden"
                      />
                    </div>
                    
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="ceremony">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 min-h-[200px]"
                          >
                            {getImagesByCategory("ceremony").map((image, index) => (
                              <Draggable key={image.id} draggableId={`ceremony-${image.id}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex bg-white p-2 rounded-md border shadow-sm"
                                  >
                                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col mr-2 text-right">
                                      <div className="text-sm truncate">{image.alt}</div>
                                      <div className="flex gap-2 mt-auto">
                                        <Button 
                                          onClick={() => toggleImageFeatured(image.id)}
                                          variant={image.featured ? "default" : "outline"}
                                          size="sm"
                                          className="h-7 px-1 flex-1"
                                        >
                                          <Heart className="h-3 w-3 ml-1" fill={image.featured ? "currentColor" : "none"} />
                                          {image.featured ? "מודגשת" : "לא מודגשת"}
                                        </Button>
                                        <Button 
                                          onClick={() => deleteImage(image.id)}
                                          variant="outline"
                                          size="sm"
                                          className="h-7 w-7 p-0 text-destructive"
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
                                            className="h-4 w-4"
                                          >
                                            <path d="M18 6L6 18M6 6l12 12" />
                                          </svg>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                  
                  {/* Reception Category */}
                  <div className="border p-3 rounded-lg">
                    <h4 className="font-medium mb-3 text-center">רחבת ריקודים</h4>
                    <div className="flex justify-center mb-3">
                      <label 
                        htmlFor="reception-upload" 
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>העלאת תמונות</span>
                      </label>
                      <input 
                        id="reception-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGalleryImagesChange(e, "reception")}
                        className="hidden"
                      />
                    </div>
                    
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="reception">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 min-h-[200px]"
                          >
                            {getImagesByCategory("reception").map((image, index) => (
                              <Draggable key={image.id} draggableId={`reception-${image.id}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex bg-white p-2 rounded-md border shadow-sm"
                                  >
                                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col mr-2 text-right">
                                      <div className="text-sm truncate">{image.alt}</div>
                                      <div className="flex gap-2 mt-auto">
                                        <Button 
                                          onClick={() => toggleImageFeatured(image.id)}
                                          variant={image.featured ? "default" : "outline"}
                                          size="sm"
                                          className="h-7 px-1 flex-1"
                                        >
                                          <Heart className="h-3 w-3 ml-1" fill={image.featured ? "currentColor" : "none"} />
                                          {image.featured ? "מודגשת" : "לא מודגשת"}
                                        </Button>
                                        <Button 
                                          onClick={() => deleteImage(image.id)}
                                          variant="outline"
                                          size="sm"
                                          className="h-7 w-7 p-0 text-destructive"
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
                                            className="h-4 w-4"
                                          >
                                            <path d="M18 6L6 18M6 6l12 12" />
                                          </svg>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/gallery', '_blank')} 
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4 ml-2" />
                    <span>צפה בגלריה</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span>תבניות הודעות</span>
                  <MessageSquare className="h-5 w-5 mr-2" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ערוך את תוכן ההודעות שישלחו לאורחים בשלבים שונים של האירוע
                </p>
                
                <Tabs defaultValue="invitation" className="mt-4">
                  <TabsList className="mb-4 w-full grid grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="invitation">הזמנה</TabsTrigger>
                    <TabsTrigger value="reminder">תזכורת</TabsTrigger>
                    <TabsTrigger value="dayBefore">יום לפני</TabsTrigger>
                    <TabsTrigger value="eventDay">יום האירוע</TabsTrigger>
                    <TabsTrigger value="thankYou">תודה</TabsTrigger>
                  </TabsList>
                  
                  {Object.entries(messages).map(([key, text]) => (
                    <TabsContent key={key} value={key} className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">תבנית הודעת {key === 'invitation' ? 'הזמנה' : 
                                                                 key === 'reminder' ? 'תזכורת' : 
                                                                 key === 'dayBefore' ? 'יום לפני' : 
                                                                 key === 'eventDay' ? 'יום האירוע' : 'תודה'}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          ניתן להשתמש בתגיות [שם], [קישור], [שעה], [מיקום] שיוחלפו בפרטים האמיתיים בעת השליחה.
                        </p>
                        
                        <Textarea 
                          value={text} 
                          onChange={(e) => setMessages(prev => ({...prev, [key]: e.target.value}))}
                          rows={6}
                          className="mb-4 text-right"
                          dir="rtl"
                        />
                        
                        <Button onClick={() => handleSaveMessage(key as keyof typeof messages)} className="flex items-center gap-2">
                          <Save className="h-4 w-4 ml-2" />
                          <span>שמור שינויים</span>
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;

