
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, HomeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { signUpWithEmail } from "@/utils/authUtils";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !confirmPassword) {
      setError('נא למלא את כל השדות');
      return;
    }
    
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
      const { success, error } = await signUpWithEmail(email, password);
      
      if (!success) {
        throw new Error(error);
      }
      
      toast({
        title: "הרשמה בוצעה בהצלחה",
        description: "נשלח אימייל לאימות החשבון שלך",
      });
      
      // Redirect to login page for email confirmation message
      navigate('/login', { state: { emailConfirmation: true } });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'אירעה שגיאה בעת ההרשמה');
      toast({
        title: "שגיאה",
        description: err.message || 'אירעה שגיאה בעת ההרשמה',
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
            <CardTitle className="text-2xl text-right">הרשמה למערכת</CardTitle>
          </div>
          <CardDescription className="text-right">
            צור חשבון חדש לניהול האירוע
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
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
              <Label htmlFor="password" className="text-right block">סיסמה</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">אימות סיסמה</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="הזן שוב את הסיסמה" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>מבצע הרשמה...</span>
                </>
              ) : (
                <span>הרשמה</span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between flex-row-reverse">
          <div className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <Link to="/login">
              <span>כבר יש לך חשבון? התחבר</span>
              <ArrowRight className="inline ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
