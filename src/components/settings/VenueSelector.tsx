
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Locate, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VenueSelectorProps {
  onVenueSelected: (venue: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

// Sample venue data - in a real app this would come from an API
const sampleVenues = [
  { 
    id: 1,
    name: 'אולמי הגן הקסום',
    address: 'רחוב הפרחים 123, תל אביב',
    lat: 32.0853,
    lng: 34.7818
  },
  { 
    id: 2,
    name: 'אולמי השרון',
    address: 'דרך השרון 45, הרצליה',
    lat: 32.1624,
    lng: 34.8447
  },
  { 
    id: 3,
    name: 'אחוזת רונית',
    address: 'רחוב האלון 78, רעננה',
    lat: 32.1836,
    lng: 34.8702
  },
  { 
    id: 4,
    name: 'גני האביב',
    address: 'רחוב הדקל 15, ראשון לציון',
    lat: 31.9730,
    lng: 34.7925
  },
  { 
    id: 5,
    name: 'אולמי רויאל',
    address: 'שדרות ירושלים 32, חולון',
    lat: 32.0167,
    lng: 34.7795
  }
];

const VenueSelector: React.FC<VenueSelectorProps> = ({ onVenueSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof sampleVenues>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // In a real app, this would be an API call to search venues
    const results = sampleVenues.filter(venue => 
      venue.name.includes(searchQuery) || 
      venue.address.includes(searchQuery)
    );
    
    setSearchResults(results);
    setShowResults(true);
    
    if (results.length === 0) {
      toast({
        title: "לא נמצאו תוצאות",
        description: "נסה לחפש מונח אחר",
        variant: "destructive",
      });
    }
  };

  const handleSelectVenue = (venue: typeof sampleVenues[0]) => {
    onVenueSelected({
      name: venue.name,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng
    });
    
    setSearchQuery('');
    setShowResults(false);
  };

  const handleDetectLocation = () => {
    // In a real app, this would use the browser's geolocation API
    // and then reverse geocode to find the nearest address
    toast({
      title: "מאתר את מיקומך...",
      description: "המיקום יעודכן בקרוב",
    });
    
    // Simulate location detection with a random venue from our sample
    setTimeout(() => {
      const randomVenue = sampleVenues[Math.floor(Math.random() * sampleVenues.length)];
      onVenueSelected({
        name: randomVenue.name,
        address: randomVenue.address,
        lat: randomVenue.lat,
        lng: randomVenue.lng
      });
      
      toast({
        title: "מיקום אותר בהצלחה",
        description: `נמצא: ${randomVenue.name}`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            className="pr-10"
            placeholder="חפש לפי שם האולם או כתובת..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>חפש</Button>
        <Button variant="outline" onClick={handleDetectLocation}>
          <Locate className="h-4 w-4 ml-2" />
          <span>איתור מיקום</span>
        </Button>
      </div>
      
      {showResults && searchResults.length > 0 && (
        <div className="border rounded-md divide-y">
          {searchResults.map((venue) => (
            <div 
              key={venue.id} 
              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleSelectVenue(venue)}
            >
              <p className="font-medium">{venue.name}</p>
              <p className="text-sm text-gray-500">{venue.address}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-500">בחר מיקום מהרשימה או הזן את פרטי המיקום ידנית בשדות למטה.</p>
      </div>
    </div>
  );
};

export default VenueSelector;
