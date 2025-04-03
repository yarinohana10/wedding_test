
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/utils/authUtils";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if the URL has the access_token
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) {
      setError('קישור לא תקין לאיפוס סיסמה. אנא נסה להזמין קישור חדש.');
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 6) {
      setError('סיסמה חייבת להיות באורך של 6 תווים לפחות');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('סיסמאות אינן תואמות');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await updatePassword(password);
      
      if (!success) {
        throw new Error(error);
      }
      
      setIsSuccess(true);
      toast({
        title: "סיסמה עודכנה בהצלחה",
        description: "ניתן להתחבר כעת עם הסיסמה החדשה",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה בעת עדכון הסיסמה');
      toast({
        title: "שגיאה",
        description: err.message || 'אירעה שגיאה בעת עדכון הסיסמה',
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
          <CardTitle className="text-2xl text-right">עדכון סיסמה</CardTitle>
          <CardDescription className="text-right">
            הזן סיסמה חדשה לחשבון שלך
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                סיסמתך עודכנה בהצלחה
              </p>
              <p className="text-sm text-gray-500">
                מועבר למסך התחברות...
              </p>
            </div>
          ) : error && !error.includes('קישור') ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 ml-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-2">
                {error}
              </p>
              <Link to="/forgot-password">
                <Button className="mt-4">
                  בקש קישור חדש
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">סיסמה חדשה</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="הזן סיסמה חדשה" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">אימות סיסמה</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="הזן שוב את הסיסמה החדשה" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>מעדכן...</span>
                  </>
                ) : (
                  <span>עדכן סיסמה</span>
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

export default ResetPassword;
