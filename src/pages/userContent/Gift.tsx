
import React, { useState } from 'react';
import Navbar from '@/pages/Navbar';
import Footer from '@/pages/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Gift as GiftIcon, CreditCard, Building, Copy, Check, Heart } from "lucide-react";

const Gift = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    
    toast({
      title: "הועתק ללוח",
      description: "המידע הועתק ללוח בהצלחה",
    });
    
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would actually send the form
    console.log(formData);
    
    toast({
      title: "ברכתך נשלחה בהצלחה",
      description: "תודה על הברכה החמה!",
    });
    
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <GiftIcon className="text-wedding-primary mr-2" size={28} />
                <h1 className="text-3xl md:text-4xl font-bold">השאירו מתנה</h1>
              </div>
              <p className="text-gray-600 mb-8">נשמח אם תשתתפו בשמחתנו</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white overflow-hidden">
                <CardHeader className="bg-wedding-primary text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Building size={20} />
                    <span>העברה בנקאית</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">שם הבנק</p>
                    <p className="font-medium">בנק לאומי</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">מספר סניף</p>
                    <p className="font-medium">782</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">מספר חשבון</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">12345678</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 pl-2"
                        onClick={() => copyToClipboard('12345678', 'account')}
                      >
                        {copied === 'account' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">על שם</p>
                    <p className="font-medium">דנה ויוסי ישראלי</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white overflow-hidden">
                <CardHeader className="bg-wedding-primary text-white">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard size={20} />
                    <span>תשלום בביט / פייבוקס</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">מספר טלפון לתשלום</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">050-1234567</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 pl-2"
                        onClick={() => copyToClipboard('0501234567', 'phone')}
                      >
                        {copied === 'phone' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-gray-500 mb-2">או סרקו את קוד ה-QR</p>
                    <div className="border rounded-lg overflow-hidden p-4 flex justify-center">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tel:0501234567" 
                        alt="QR Code" 
                        className="h-28 w-28"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart size={20} className="text-wedding-primary" />
                  <span>השאירו ברכה</span>
                </CardTitle>
                <CardDescription>
                  נשמח לקבל ברכות וחיבוקים וירטואליים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">שם</label>
                      <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleFormChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">אימייל</label>
                      <Input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleFormChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ברכה</label>
                    <Textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleFormChange} 
                      rows={5} 
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-wedding-primary hover:bg-wedding-accent text-white w-full md:w-auto"
                  >
                    שליחת ברכה
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gift;
