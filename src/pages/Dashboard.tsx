
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Users,
  CheckCircle,
  XCircle,
  CalendarClock,
  Search
} from "lucide-react";

const Dashboard = () => {
  // Sample data - in a real app this would come from your backend
  const stats = {
    totalGuests: 150,
    confirmed: 85,
    pending: 65,
    daysLeft: 45
  };

  // Sample guests confirmation data
  const guestConfirmations = [
    { id: 1, name: "דניאל כהן", phone: "050-1234567", guests: 2, status: "אישר הגעה", food: "רגיל" },
    { id: 2, name: "מיכל לוי", phone: "052-7654321", guests: 1, status: "אישר הגעה", food: "צמחוני" },
    { id: 3, name: "יוסי אברהם", phone: "054-9876543", guests: 4, status: "טרם אישר", food: "-" },
    { id: 4, name: "רונית דוד", phone: "053-1472583", guests: 2, status: "אישר הגעה", food: "רגיל" },
    { id: 5, name: "אייל גולן", phone: "058-3698521", guests: 3, status: "טרם אישר", food: "-" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">לוח בקרה</h1>
        <p className="text-muted-foreground">
          ברוכים הבאים למערכת ניהול האירוע
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה"כ מוזמנים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              מספר האורחים הכולל
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">אישרו הגעה</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.confirmed / stats.totalGuests) * 100)}% מכלל המוזמנים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">טרם אישרו</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.pending / stats.totalGuests) * 100)}% מכלל המוזמנים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ימים לאירוע</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.daysLeft}</div>
            <p className="text-xs text-muted-foreground">
              ימים נותרו עד לאירוע
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>סיכום אישורי הגעה</CardTitle>
            <CardDescription>
              סקירה של אישורי ההגעה הנוכחיים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם או מספר טלפון..."
                className="pr-3 pl-10"
              />
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guestConfirmations.map((guest) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
