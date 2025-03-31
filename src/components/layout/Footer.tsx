
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-8 mt-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-wedding-primary mr-2" />
            <span className="font-heebo font-medium">Wedding Joy</span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>© {new Date().getFullYear()} כל הזכויות שמורות</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
