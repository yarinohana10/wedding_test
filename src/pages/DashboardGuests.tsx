
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search, Download } from "lucide-react";

// Sample guest data
const guests = [
  { id: 1, name: "דניאל כהן", phone: "050-1234567", guests: 2, status: "אישר הגעה", food: "רגיל" },
  { id: 2, name: "מיכל לוי", phone: "052-7654321", guests: 1, status: "אישר הגעה", food: "צמחוני" },
  { id: 3, name: "יוסי אברהם", phone: "054-9876543", guests: 4, status: "טרם אישר", food: "-" },
  { id: 4, name: "רונית דוד", phone: "053-1472583", guests: 2, status: "אישר הגעה", food: "רגיל" },
  { id: 5, name: "אייל גולן", phone: "058-3698521", guests: 3, status: "טרם אישר", food: "-" },
];

const DashboardGuests = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ניהול מוזמנים</h1>
        <p className="text-muted-foreground">
          רשימת המוזמנים לאירוע
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש מוזמנים..."
            className="pr-3 pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>ייצוא לאקסל</span>
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>הוספת מוזמן</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardGuests;
