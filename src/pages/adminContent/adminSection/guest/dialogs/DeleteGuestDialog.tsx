
import React from "react";
import { Button } from "@/components/ui/button";
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
  id: string;
  name: string;
  [key: string]: any;
}

interface DeleteGuestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  guestToDelete: Guest | null;
  confirmDelete: () => void;
  isLoading: boolean;
}

const DeleteGuestDialog: React.FC<DeleteGuestDialogProps> = ({
  isOpen,
  setIsOpen,
  guestToDelete,
  confirmDelete,
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
          <DialogTitle className="text-right">מחיקת מוזמן</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center">
            האם אתה בטוח שברצונך למחוק את {guestToDelete?.name} מרשימת
            המוזמנים?
          </p>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            ביטול
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            מחק
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGuestDialog;
