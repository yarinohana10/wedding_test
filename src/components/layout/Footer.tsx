
import React from 'react';
import { Heart, Phone, Mail, MapPin, FileText, Accessibility } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white py-8 mt-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 text-wedding-primary mr-2" fill="currentColor" />
              <span className="font-heebo font-medium">Wedding Joy</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              אנו מספקים פתרונות ייחודיים לניהול אירועי חתונה, עם דגש על חוויית משתמש מעולה וממשק אינטראקטיבי.
            </p>
          </div>
          
          <div className="flex flex-col items-start">
            <h3 className="font-medium mb-4">מידע חשוב</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-wedding-primary" />
                <Link to="/terms" className="hover:text-wedding-accent transition">תקנון שימוש</Link>
              </li>
              <li className="flex items-center">
                <Accessibility className="h-4 w-4 mr-2 text-wedding-primary" />
                <Link to="/accessibility" className="hover:text-wedding-accent transition">מדיניות נגישות</Link>
              </li>
              <li className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-wedding-primary" />
                <Link to="/privacy" className="hover:text-wedding-accent transition">מדיניות פרטיות</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-start">
            <h3 className="font-medium mb-4">צור קשר</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-wedding-primary" />
                <a href="tel:+972501234567" className="hover:text-wedding-accent transition">050-1234567</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-wedding-primary" />
                <a href="mailto:contact@wedding-joy.com" className="hover:text-wedding-accent transition">contact@wedding-joy.com</a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-wedding-primary" />
                <span>רחוב השלום 123, תל אביב</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Wedding Joy. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
