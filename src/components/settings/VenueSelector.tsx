
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState(defaultValue || '');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load Google Maps API script dynamically
    const loadGoogleMapsScript = () => {
      const googleMapsApiKey = 'REPLACE_WITH_YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      // Expose initAutocomplete to the window object
      window.initAutocomplete = initAutocomplete;
      
      return () => {
        document.head.removeChild(script);
        delete window.initAutocomplete;
      };
    };
    
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initAutocomplete();
    }
  }, []);
  
  const initAutocomplete = () => {
    if (!searchInputRef.current || !window.google) return;
    
    // Initialize the autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
      types: ['establishment'],
      fields: ['geometry', 'name', 'formatted_address'],
      componentRestrictions: { country: 'il' } // Restrict to Israel
    });
    
    // Set the default search language to Hebrew
    autocompleteRef.current.setOptions({
      language: 'he'
    });
    
    // Add listener for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place || !place.geometry || !place.geometry.location) {
        toast({
          title: "שגיאה",
          description: "לא ניתן למצוא פרטים עבור המקום שנבחר",
          variant: "destructive"
        });
        return;
      }
      
      const venueData = {
        name: place.name || '',
        address: place.formatted_address || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      
      onVenueSelected(venueData);
      setSearchQuery(place.name || '');
      
      toast({
        title: "מיקום נבחר בהצלחה",
        description: `${place.name}`,
      });
    });
  };
  
  const handleManualSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "שגיאה",
        description: "נא להזין שם מקום לחיפוש",
        variant: "destructive"
      });
      return;
    }
    
    // Trigger place selection manually if user didn't select from dropdown
    if (window.google && autocompleteRef.current) {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.findPlaceFromQuery({
        query: searchQuery,
        fields: ['geometry', 'name', 'formatted_address']
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const place = results[0];
          if (place.geometry && place.geometry.location) {
            const venueData = {
              name: place.name || '',
              address: place.formatted_address || '',
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            
            onVenueSelected(venueData);
            setSearchQuery(place.name || '');
            
            toast({
              title: "מיקום נבחר בהצלחה",
              description: `${place.name}`,
            });
          }
        } else {
          toast({
            title: "לא נמצאו תוצאות",
            description: "נסה לחפש שוב עם מונחים אחרים",
            variant: "destructive"
          });
        }
      });
    }
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
        const { latitude, longitude } = position.coords;
        
        // Use reverse geocoding to find address at these coordinates
        if (window.google) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const place = results[0];
              const venueData = {
                name: place.name || place.formatted_address || 'המיקום הנוכחי שלי',
                address: place.formatted_address || '',
                lat: latitude,
                lng: longitude
              };
              
              onVenueSelected(venueData);
              setSearchQuery(venueData.name);
              
              toast({
                title: "מיקום אותר בהצלחה",
                description: venueData.address,
              });
            } else {
              toast({
                title: "שגיאה",
                description: "לא ניתן למצוא כתובת עבור המיקום הנוכחי",
                variant: "destructive"
              });
            }
          });
        }
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
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            ref={searchInputRef}
            className="pr-10 text-right"
            placeholder="חפש לפי שם האולם או כתובת..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
          />
        </div>
        <Button onClick={handleManualSearch}>חפש</Button>
        <Button variant="outline" onClick={handleDetectLocation}>
          <MapPin className="h-4 w-4 ml-2" />
          <span>איתור מיקום</span>
        </Button>
      </div>
      
      <div className="bg-wedding-primary/10 p-3 rounded-md">
        <p className="text-sm text-gray-600 text-right">בחר מיקום מהרשימה או אתר את מיקומך הנוכחי בעזרת הכפתור. המיקום שנבחר יופיע במפה באתר שלך.</p>
      </div>
    </div>
  );
};

// Add a type declaration for Google Maps API
declare global {
  interface Window {
    google: typeof google;
    initAutocomplete: () => void;
  }
}

export default VenueSelector;
