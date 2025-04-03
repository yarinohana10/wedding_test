
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle, HomeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "שגיאה",
        description: "יש להזין כתובת דוא״ל",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "נשלח בהצלחה",
        description: "קישור לאיפוס סיסמה נשלח לדוא״ל שלך",
      });
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בעת שליחת קישור לאיפוס סיסמה",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <Card className="w-full max-w-md mx-auto shadow-lg text-right">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-wedding-dark hover:text-wedding-primary"
            >
              <HomeIcon className="h-4 w-4 ml-1" />
              <span>חזרה לדף הבית</span>
            </Button>
            <CardTitle className="text-2xl text-right">שכחתי סיסמה</CardTitle>
          </div>
          <CardDescription className="text-right">
            {isSubmitted 
              ? "קישור לאיפוס סיסמה נשלח לדוא״ל שלך" 
              : "הזן את כתובת הדוא״ל שלך כדי לקבל קישור לאיפוס סיסמה"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                בדוק את תיבת הדואר האלקטרוני שלך לקבלת הוראות לאיפוס סיסמה
              </p>
              <p className="text-sm text-gray-500">
                אם לא קיבלת אימייל תוך מספר דקות, בדוק את תיקיית הספאם שלך
              </p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">דוא״ל</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="הזן את כתובת הדוא״ל" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-2 bg-wedding-primary hover:bg-wedding-accent text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>שולח...</span>
                  </>
                ) : (
                  <span>שלח קישור לאיפוס סיסמה</span>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter>
          <div className="w-full flex justify-end">
            <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <span>חזרה למסך התחברות</span>
              <ArrowRight className="mr-1 h-4 w-4" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
