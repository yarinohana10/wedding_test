
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, MoveLeft } from 'lucide-react';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would normally authenticate with a backend
    if (formData.email === 'admin@example.com' && formData.password === 'password') {
      toast({
        title: "התחברות הצליחה",
        description: "ברוכים הבאים למערכת ניהול האירוע!",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      toast({
        title: "התחברות נכשלה",
        description: "אימייל או סיסמה שגויים, אנא נסו שוב.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 gradient-bg">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex justify-center items-center gap-2">
            <Lock className="h-5 w-5 text-wedding-primary" />
            <span>כניסה לאיזור ניהול</span>
          </CardTitle>
          <CardDescription>
            הכנס פרטי התחברות לאיזור ניהול האירוע
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-wedding-primary hover:bg-wedding-accent"
            >
              התחברות
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" asChild className="flex items-center gap-1">
            <Link to="/">
              <MoveLeft className="h-4 w-4 ml-1" />
              <span>חזרה לדף הבית</span>
            </Link>
          </Button>
          <Button variant="link" asChild>
            <Link to="/">
              שכחתי סיסמה
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
