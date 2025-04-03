
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Save, Search } from "lucide-react";

interface EventDetails {
  coupleName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
}

interface EventDetailsFormProps {
  eventDetails: EventDetails;
  handleEventDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchVenue: string;
  setSearchVenue: (venue: string) => void;
  searchVenues: () => void;
  isSearching: boolean;
  searchResults: any[];
  selectVenue: (venue: any) => void;
  handleSaveEventDetails: () => void;
}

const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
  eventDetails,
  handleEventDetailsChange,
  searchVenue,
  setSearchVenue,
  searchVenues,
  isSearching,
  searchResults,
  selectVenue,
  handleSaveEventDetails,
}) => {
  return (
    <>
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
                    <div className="text-sm text-gray-500">
                      {venue.address}
                    </div>
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

      <div className="flex items-center gap-4 justify-between">
        <Button
          onClick={handleSaveEventDetails}
          className="flex items-center gap-2 mt-4"
        >
          <Save className="h-4 w-4 ml-2" />
          <span>שמור שינויים</span>
        </Button>
      </div>
    </>
  );
};

export default EventDetailsForm;
