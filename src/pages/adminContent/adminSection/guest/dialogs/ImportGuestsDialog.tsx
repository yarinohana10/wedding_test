
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FilePlus, FileUp, Loader2, X } from "lucide-react";

interface ImportGuestsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isImporting: boolean;
  downloadExcelTemplate: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImportGuestsDialog: React.FC<ImportGuestsDialogProps> = ({
  isOpen,
  setIsOpen,
  isImporting,
  downloadExcelTemplate,
  handleFileChange,
  fileInputRef,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">סגור</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-right">
            ייבוא מוזמנים מאקסל
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-6 text-right">
            העלה קובץ אקסל עם רשימת מוזמנים. הקובץ צריך להכיל עמודות "שם"
            ו"טלפון". מספרי טלפון זהים לא יתווספו בשנית. ניתן להוריד תבנית
            לדוגמה.
          </p>

          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={downloadExcelTemplate}
            >
              <FilePlus className="h-4 w-4 ml-1" />
              הורד תבנית לדוגמה
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            {isImporting ? (
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-wedding-primary" />
                <p>מייבא מוזמנים...</p>
              </div>
            ) : (
              <div>
                <FileUp className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="mb-2">גרור קובץ לכאן או</p>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-wedding-primary/10 hover:bg-wedding-primary/20 border-wedding-primary/20 text-wedding-dark"
                  onClick={() => fileInputRef.current?.click()}
                >
                  בחר קובץ
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            ביטול
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportGuestsDialog;
