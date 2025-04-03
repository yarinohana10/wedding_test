
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import StatisticsCards from "./dashboard/StatisticsCards";
import GuestConfirmationTable from "./dashboard/GuestConfirmationTable";

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

      <StatisticsCards stats={stats} />

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
            
            <GuestConfirmationTable guests={guestConfirmations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
