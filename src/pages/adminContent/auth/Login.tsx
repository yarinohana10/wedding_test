
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle, HomeIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  emailConfirmation?: boolean;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for email confirmation message from registration
    const state = location.state as LocationState;
    if (state?.emailConfirmation) {
      setShowEmailConfirmation(true);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('נא למלא את כל השדות');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "התחברת בהצלחה",
        description: "מועבר לדשבורד...",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      
      // Handle specific error cases
      if (err.message?.includes('Email not confirmed')) {
        setError('כתובת הדוא״ל טרם אומתה. אנא בדוק את תיבת הדואר שלך.');
      } else if (err.message?.includes('Invalid login')) {
        setError('אימייל או סיסמה שגויים');
      } else {
        setError(err.message || 'אירעה שגיאה בעת ההתחברות');
      }
      
      toast({
        title: "שגיאה",
        description: "התחברות נכשלה. אנא בדוק את הפרטים שהוזנו.",
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
            <CardTitle className="text-2xl text-right">התחברות למערכת</CardTitle>
          </div>
          <CardDescription className="text-right">
            התחבר כדי לנהל את האירוע שלך
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {showEmailConfirmation && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 flex items-start">
              <CheckCircle className="text-blue-500 h-5 w-5 mt-0.5 ml-2 flex-shrink-0" />
              <div>
                <p className="text-blue-700 text-sm">נשלח אימייל לאימות החשבון שלך</p>
                <p className="text-xs text-blue-600 mt-1">אנא בדוק את תיבת הדואר שלך ולחץ על הקישור לאימות</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  שכחתי סיסמה
                </Link>
                <Label htmlFor="password" className="text-right block">סיסמה</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="הזן סיסמה" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4 bg-wedding-primary hover:bg-wedding-accent text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  <span>מתחבר...</span>
                </>
              ) : (
                <span>התחברות</span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between flex-row-reverse">
          <div className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <Link to="/register">
              <span>אין לך חשבון? הירשם עכשיו</span>
              <ArrowRight className="inline ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
