
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VenueSelectorProps {
  onVenueSelected: (venue: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: string;
}

const VenueSelector: React.FC<VenueSelectorProps> = ({ onVenueSelected, defaultValue }) => {
  const [venueName, setVenueName] = useState(defaultValue?.split(',')[0] || '');
  const [venueAddress, setVenueAddress] = useState(defaultValue || '');
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (!venueName || !venueAddress) {
      toast({
        title: "שגיאה",
        description: "נא למלא את שם האולם והכתובת",
        variant: "destructive"
      });
      return;
    }
    
    // For demo purposes, we'll use fixed coordinates for Tel Aviv
    // In a real app, you would use a geocoding service to get real coordinates
    const demoCoordinates = {
      lat: 32.085341,
      lng: 34.781768
    };
    
    onVenueSelected({
      name: venueName,
      address: venueAddress,
      lat: demoCoordinates.lat,
      lng: demoCoordinates.lng
    });
    
    toast({
      title: "מיקום נשמר בהצלחה",
      description: `${venueName}, ${venueAddress}`,
    });
  };
  
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "שגיאה",
        description: "הדפדפן שלך אינו תומך באיתור מיקום",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "מאתר את מיקומך...",
      description: "המיקום יעודכן בקרוב",
    });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // For demo purposes, just set a default venue
        setVenueName("המיקום הנוכחי שלי");
        setVenueAddress("תל אביב, ישראל");
        
        const venueData = {
          name: "המיקום הנוכחי שלי",
          address: "תל אביב, ישראל",
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        onVenueSelected(venueData);
        
        toast({
          title: "מיקום אותר בהצלחה",
          description: "תל אביב, ישראל",
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "שגיאה באיתור מיקום",
          description: error.message || 'לא ניתן לאתר את מיקומך הנוכחי',
          variant: "destructive"
        });
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-right block">שם המקום</label>
          <Input
            className="text-right"
            placeholder="הזן את שם האולם או המקום..."
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-right block">כתובת מלאה</label>
          <Input
            className="text-right"
            placeholder="רחוב, עיר, מדינה..."
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button onClick={handleSubmit}>שמור מיקום</Button>
        <Button variant="outline" onClick={handleDetectLocation} className="flex items-center gap-2">
          <MapPin className="h-4 w-4 ml-2" />
          <span>איתור מיקום נוכחי</span>
        </Button>
      </div>
      
      <div className="bg-wedding-primary/10 p-3 rounded-md text-right">
        <p className="text-sm text-gray-600">הזן את שם המקום והכתובת המלאה, או לחץ על כפתור איתור מיקום. המיקום שנבחר יופיע במפה באתר שלך.</p>
      </div>
    </div>
  );
};

export default VenueSelector;
