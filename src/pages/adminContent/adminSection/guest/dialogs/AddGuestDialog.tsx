
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";

interface Guest {
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
}

interface AddGuestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newGuest: Guest;
  setNewGuest: (guest: Guest) => void;
  handleAddGuest: () => void;
  isLoading: boolean;
}

const AddGuestDialog: React.FC<AddGuestDialogProps> = ({
  isOpen,
  setIsOpen,
  newGuest,
  setNewGuest,
  handleAddGuest,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">סגור</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-right">הוספת מוזמן חדש</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">שם מלא</Label>
            <Input
              value={newGuest.name}
              onChange={(e) =>
                setNewGuest({ ...newGuest, name: e.target.value })
              }
              className="col-span-3 text-right"
              placeholder="הכנס שם מלא"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">טלפון</Label>
            <Input
              value={newGuest.phone}
              onChange={(e) =>
                setNewGuest({ ...newGuest, phone: e.target.value })
              }
              className="col-span-3 text-right"
              placeholder="050-1234567"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">מספר אורחים</Label>
            <Input
              type="number"
              min="1"
              value={newGuest.guests}
              onChange={(e) =>
                setNewGuest({
                  ...newGuest,
                  guests: parseInt(e.target.value) || 1,
                })
              }
              className="col-span-3 text-right"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">סטטוס</Label>
            <Select
              value={newGuest.status}
              onValueChange={(value) =>
                setNewGuest({ ...newGuest, status: value })
              }
            >
              <SelectTrigger className="col-span-3 text-right">
                <SelectValue placeholder="בחר סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="אישר הגעה">אישר הגעה</SelectItem>
                <SelectItem value="טרם אישר">טרם אישר</SelectItem>
                <SelectItem value="לא מגיע">לא מגיע</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">העדפת אוכל</Label>
            <Select
              value={newGuest.food}
              onValueChange={(value) =>
                setNewGuest({ ...newGuest, food: value })
              }
            >
              <SelectTrigger className="col-span-3 text-right">
                <SelectValue placeholder="בחר העדפת אוכל" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="רגיל">רגיל</SelectItem>
                <SelectItem value="צמחוני">צמחוני</SelectItem>
                <SelectItem value="טבעוני">טבעוני</SelectItem>
                <SelectItem value="-">לא רלוונטי</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            ביטול
          </Button>
          <Button
            onClick={handleAddGuest}
            disabled={isLoading}
            className="bg-wedding-primary hover:bg-wedding-accent text-white"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            הוסף מוזמן
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;
