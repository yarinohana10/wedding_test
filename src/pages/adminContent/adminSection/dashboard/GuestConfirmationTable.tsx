
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Guest {
  id: number;
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
}

interface GuestConfirmationTableProps {
  guests: Guest[];
}

const GuestConfirmationTable: React.FC<GuestConfirmationTableProps> = ({ guests }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right font-bold">שם מלא</TableHead>
            <TableHead className="text-right font-bold">מספר טלפון</TableHead>
            <TableHead className="text-right font-bold">כמות אורחים</TableHead>
            <TableHead className="text-right font-bold">סטטוס</TableHead>
            <TableHead className="text-right font-bold">העדפת אוכל</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-medium">{guest.name}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.guests}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  guest.status === 'אישר הגעה' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {guest.status}
                </span>
              </TableCell>
              <TableCell>{guest.food}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestConfirmationTable;
