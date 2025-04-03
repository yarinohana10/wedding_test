
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import MessageTemplateEditor from './messages/MessageTemplateEditor';

export interface MessageTemplates {
  invitation: string;
  reminder: string;
  dayBefore: string;
  eventDay: string;
  thankYou: string;
}

const DashboardMessages = () => {
  const [messages, setMessages] = useState<MessageTemplates>({
    invitation: "היי [שם]! אנחנו שמחים להזמין אותך לחתונה שלנו! נא אשר את הגעתך בקישור: [קישור]",
    reminder: "היי [שם], רק להזכיר שהחתונה שלנו תתקיים בעוד שבוע! נשמח לראותך שם.",
    dayBefore: "היי [שם], החתונה שלנו מחר! אנחנו מצפים לראותך.",
    eventDay: "היי [שם], החתונה שלנו היום! אנחנו מצפים לראותך בשעה [שעה] ב[מיקום].",
    thankYou: "היי [שם], תודה שהגעת לחתונה שלנו! היה לנו כיף גדול ושמחנו לחגוג איתך!"
  });

  const handleMessageChange = (key: keyof MessageTemplates, value: string) => {
    setMessages(prev => ({...prev, [key]: value}));
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
                <MessageTemplateEditor 
                  templateKey={key as keyof MessageTemplates} 
                  templateText={text} 
                  onChange={handleMessageChange} 
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMessages;
