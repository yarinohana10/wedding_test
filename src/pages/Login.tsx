
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a mock authentication - in a real app, this would connect to a backend
    setTimeout(() => {
      // Mock login check - replace with actual authentication
      if (username === 'admin' && password === 'password') {
        toast({
          title: "התחברות מוצלחת",
          description: "ברוכים הבאים למערכת ניהול האירוע",
          variant: "default",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "שגיאת התחברות",
          description: "שם משתמש או סיסמה שגויים",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <Heart className="h-12 w-12 text-wedding-primary" />
            </div>
            <h1 className="text-2xl font-bold">איזור חתן כלה</h1>
            <p className="text-gray-600 text-sm mt-1">התחברו כדי לנהל את האירוע שלכם</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                שם משתמש
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="הזן שם משתמש"
                  className="pr-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                סיסמה
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="הזן סיסמה"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-wedding-primary hover:bg-wedding-accent"
              disabled={isLoading}
            >
              {isLoading ? 'מתחבר...' : 'התחברות'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              *לצורך הדגמה, השתמשו בשם משתמש: admin וסיסמה: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
