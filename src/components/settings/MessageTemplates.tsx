
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MessageTemplatesProps {
  messages: {
    invitation: string;
    reminder: string;
    dayBefore: string;
    eventDay: string;
    thankYou: string;
  };
  setMessages: React.Dispatch<React.SetStateAction<{
    invitation: string;
    reminder: string;
    dayBefore: string;
    eventDay: string;
    thankYou: string;
  }>>;
  handleSaveMessage: (messageType: "invitation" | "reminder" | "dayBefore" | "eventDay" | "thankYou") => void;
}

const MessageTemplates: React.FC<MessageTemplatesProps> = ({
  messages,
  setMessages,
  handleSaveMessage,
}) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <span>תבניות הודעות</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 mr-2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        ערוך את תוכן ההודעות שישלחו לאורחים בשלבים שונים של האירוע
      </p>

      <Tabs defaultValue="invitation" className="mt-4">
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
              <h3 className="text-lg font-medium mb-2">
                תבנית הודעת{" "}
                {key === "invitation"
                  ? "הזמנה"
                  : key === "reminder"
                  ? "תזכורת"
                  : key === "dayBefore"
                  ? "יום לפני"
                  : key === "eventDay"
                  ? "יום האירוע"
                  : "תודה"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                ניתן להשתמש בתגיות [שם], [קישור], [שעה], [מיקום]
                שיוחלפו בפרטים האמיתיים בעת השליחה.
              </p>

              <Textarea
                value={text}
                onChange={(e) =>
                  setMessages((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                rows={6}
                className="mb-4 text-right"
                dir="rtl"
              />

              <Button
                onClick={() =>
                  handleSaveMessage(key as keyof typeof messages)
                }
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4 ml-2" />
                <span>שמור שינויים</span>
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MessageTemplates;
