
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Save } from "lucide-react";

const DashboardMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState({
    invitation: "היי [שם]! אנחנו שמחים להזמין אותך לחתונה שלנו! נא אשר את הגעתך בקישור: [קישור]",
    reminder: "היי [שם], רק להזכיר שהחתונה שלנו תתקיים בעוד שבוע! נשמח לראותך שם.",
    dayBefore: "היי [שם], החתונה שלנו מחר! אנחנו מצפים לראותך.",
    eventDay: "היי [שם], החתונה שלנו היום! אנחנו מצפים לראותך בשעה [שעה] ב[מיקום].",
    thankYou: "היי [שם], תודה שהגעת לחתונה שלנו! היה לנו כיף גדול ושמחנו לחגוג איתך!"
  });

  const handleSave = (messageType: keyof typeof messages) => {
    // In a real app, this would save to a database
    toast({
      title: "הודעה נשמרה",
      description: "תבנית ההודעה עודכנה בהצלחה",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ניהול הודעות</h1>
        <p className="text-muted-foreground">
          עריכת תבניות הודעות לתקשורת עם האורחים
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>תבניות הודעות</span>
          </CardTitle>
          <CardDescription>
            ערוך את תוכן ההודעות שישלחו לאורחים בשלבים שונים של האירוע
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="invitation">
            <TabsList className="mb-4 w-full grid grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="invitation">הזמנה</TabsTrigger>
              <TabsTrigger value="reminder">תזכורת</TabsTrigger>
              <TabsTrigger value="dayBefore">יום לפני</TabsTrigger>
              <TabsTrigger value="eventDay">יום האירוע</TabsTrigger>
              <TabsTrigger value="thankYou">תודה</TabsTrigger>
            </TabsList>
            
            {Object.entries(messages).map(([key, text]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">תבנית הודעת {key === 'invitation' ? 'הזמנה' : 
                                                           key === 'reminder' ? 'תזכורת' : 
                                                           key === 'dayBefore' ? 'יום לפני' : 
                                                           key === 'eventDay' ? 'יום האירוע' : 'תודה'}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ניתן להשתמש בתגיות [שם], [קישור], [שעה], [מיקום] שיוחלפו בפרטים האמיתיים בעת השליחה.
                  </p>
                  
                  <Textarea 
                    value={text} 
                    onChange={(e) => setMessages(prev => ({...prev, [key]: e.target.value}))}
                    rows={6}
                    className="mb-4"
                  />
                  
                  <Button onClick={() => handleSave(key as keyof typeof messages)} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>שמור שינויים</span>
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMessages;
