
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import EditableCell from "./EditableCell";

interface Guest {
  id: string;
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
  created_at?: string | null;
  updated_at?: string | null;
}

interface GuestCardProps {
  guest: Guest;
  handleUpdateField: (guest: Guest, field: keyof Guest, value: any) => void;
  handleDelete: (guest: Guest) => void;
  getStatusColorClass: (status: string) => string;
}

const GuestCard: React.FC<GuestCardProps> = ({
  guest,
  handleUpdateField,
  handleDelete,
  getStatusColorClass,
}) => {
  const statusOptions = [
    { value: "אישר הגעה", label: "אישר הגעה" },
    { value: "טרם אישר", label: "טרם אישר" },
    { value: "לא מגיע", label: "לא מגיע" },
  ];

  const foodOptions = [
    { value: "רגיל", label: "רגיל" },
    { value: "צמחוני", label: "צמחוני" },
    { value: "טבעוני", label: "טבעוני" },
    { value: "ללא גלוטן", label: "ללא גלוטן" },
    { value: "-", label: "לא רלוונטי" },
  ];

  return (
    <Card className="p-4 mb-4" key={guest.id}>
      <div className="flex justify-between items-start mb-3">
        <div className="w-full">
          <div className="group mb-2">
            <EditableCell
              value={guest.name}
              onChange={(value) => handleUpdateField(guest, "name", value)}
              onSave={() => {}}
              type="text"
              className="text-lg font-medium"
            />
          </div>
          <div className="group">
            <EditableCell
              value={guest.phone}
              onChange={(value) => handleUpdateField(guest, "phone", value)}
              onSave={() => {}}
              type="text"
              className="text-sm text-gray-500"
            />
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(
            guest.status
          )}`}
        >
          {guest.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="group">
          <span className="text-gray-500 block mb-1">כמות אורחים:</span>
          <EditableCell
            value={guest.guests}
            onChange={(value) => handleUpdateField(guest, "guests", value)}
            onSave={() => {}}
            type="number"
          />
        </div>
        <div className="group">
          <span className="text-gray-500 block mb-1">העדפת אוכל:</span>
          <EditableCell
            value={guest.food}
            onChange={(value) => handleUpdateField(guest, "food", value)}
            onSave={() => {}}
            type="select"
            options={foodOptions}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2 gap-2">
        <div className="group">
          <span className="text-gray-500 block mb-1">סטטוס:</span>
          <EditableCell
            value={guest.status}
            onChange={(value) => handleUpdateField(guest, "status", value)}
            onSave={() => {}}
            type="select"
            options={statusOptions}
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => handleDelete(guest)}
          >
            <Trash2 className="h-4 w-4 ml-1" />
            <span>מחק</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GuestCard;
