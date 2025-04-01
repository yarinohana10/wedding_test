
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Gift, CreditCard, Wallet, Building } from 'lucide-react';

const GiftPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 bg-wedding-light">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Gift className="h-16 w-16 text-wedding-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-wedding-dark mb-4">השאירו מתנה</h1>
              <p className="text-lg text-gray-600">
                תודה שאתם חלק מהיום המיוחד שלנו!
                <br />
                אם תרצו להשאיר לנו מתנה, תוכלו לעשות זאת באחת מהדרכים הבאות:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <CreditCard className="text-wedding-primary mr-3" size={24} />
                  <h2 className="text-xl font-bold text-wedding-dark">העברה בנקאית</h2>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>בנק: 12 - הפועלים</p>
                  <p>סניף: 564</p>
                  <p>מספר חשבון: 123456</p>
                  <p>על שם: דנה ויוסי ישראלי</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Wallet className="text-wedding-primary mr-3" size={24} />
                  <h2 className="text-xl font-bold text-wedding-dark">ביט / פייבוקס</h2>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>אפשר להשתמש במספר הטלפון:</p>
                  <p className="text-lg font-medium">052-1234567</p>
                  <p>על שם: דנה ויוסי</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="flex items-center justify-center mb-4">
                <Building className="text-wedding-primary mr-2" size={24} />
                <h2 className="text-xl font-bold text-wedding-dark">מתנות פיזיות</h2>
              </div>
              <p className="text-gray-600">
                אם תרצו להביא מתנה פיזית, תוכלו להביא אותה לחתונה או לשלוח לכתובת:
                <br />
                רחוב האהבה 5, דירה 12, תל אביב.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GiftPage;
