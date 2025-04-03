import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

interface GuestsTableProps {
  filteredGuests: Guest[];
  handleUpdateField: (guest: Guest, field: keyof Guest, value: any) => void;
  handleDelete: (guest: Guest) => void;
}

const GuestsTable: React.FC<GuestsTableProps> = ({
  filteredGuests,
  handleUpdateField,
  handleDelete,
}) => {
  return (
    <div className="border border-wedding-primary/20 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right font-bold">שם מלא</TableHead>
            <TableHead className="text-right font-bold">מספר טלפון</TableHead>
            <TableHead className="text-right font-bold">כמות אורחים</TableHead>
            <TableHead className="text-right font-bold">סטטוס</TableHead>
            <TableHead className="text-right font-bold">העדפת אוכל</TableHead>
            <TableHead className="text-right font-bold">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => {
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
                <TableRow key={guest.id} className="group">
                  <TableCell className="font-medium">
                    <EditableCell
                      value={guest.name}
                      onChange={(value) =>
                        handleUpdateField(guest, "name", value)
                      }
                      onSave={() => {}}
                      type="text"
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={guest.phone}
                      onChange={(value) =>
                        handleUpdateField(guest, "phone", value)
                      }
                      onSave={() => {}}
                      type="text"
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={guest.guests}
                      onChange={(value) =>
                        handleUpdateField(guest, "guests", value)
                      }
                      onSave={() => {}}
                      type="number"
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={guest.status}
                      onChange={(value) =>
                        handleUpdateField(guest, "status", value)
                      }
                      onSave={() => {}}
                      type="select"
                      options={statusOptions}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={guest.food}
                      onChange={(value) =>
                        handleUpdateField(guest, "food", value)
                      }
                      onSave={() => {}}
                      type="select"
                      options={foodOptions}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(guest)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground"
              >
                לא נמצאו מוזמנים התואמים את החיפוש
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestsTable;
