
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Guest {
  id: string;
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
}

interface GuestCardProps {
  guest: Guest;
  onDelete: (guest: Guest) => void;
  onUpdateField: (guest: Guest, field: keyof Guest, value: any) => void;
}

const GuestCard = ({ guest, onDelete, onUpdateField }: GuestCardProps) => {
  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "אישר הגעה":
        return "bg-green-100 text-green-800";
      case "לא מגיע":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{guest.name}</h3>
            <p className="text-sm text-gray-500">{guest.phone}</p>
            <div className="flex items-center mt-1 space-x-2 space-x-reverse">
              <Badge variant="outline">{guest.guests} אורחים</Badge>
              <Badge className={getStatusColorClass(guest.status)}>{guest.status}</Badge>
              {guest.food !== 'רגיל' && guest.food !== '-' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {guest.food}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => onDelete(guest)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              מחק
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestCard;
