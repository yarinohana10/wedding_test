import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

export interface MessageTemplates {
  invitation: string;
  reminder: string;
  dayBefore: string;
  eventDay: string;
  thankYou: string;
}
interface MessageTemplateEditorProps {
  templateKey: keyof MessageTemplates;
  templateText: string;
  onChange: (key: keyof MessageTemplates, value: string) => void;
}

const templateTitles = {
  invitation: "הזמנה",
  reminder: "תזכורת",
  dayBefore: "יום לפני",
  eventDay: "יום האירוע",
  thankYou: "תודה",
};

const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = ({
  templateKey,
  templateText,
  onChange,
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to a database
    toast({
      title: "הודעה נשמרה",
      description: "תבנית ההודעה עודכנה בהצלחה",
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">
        תבנית הודעת {templateTitles[templateKey]}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        ניתן להשתמש בתגיות [שם], [קישור], [שעה], [מיקום] שיוחלפו בפרטים האמיתיים
        בעת השליחה.
      </p>

      <Textarea
        value={templateText}
        onChange={(e) => onChange(templateKey, e.target.value)}
        rows={6}
        className="mb-4"
      />

      <Button onClick={handleSave} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        <span>שמור שינויים</span>
      </Button>
    </div>
  );
};

export default MessageTemplateEditor;
