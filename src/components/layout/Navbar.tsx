
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Heart className="h-6 w-6 text-wedding-primary mr-2" />
            <span className="font-heebo font-bold text-lg text-wedding-dark">Wedding Joy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className="text-wedding-dark hover:text-wedding-accent transition">דף הבית</Link>
            <Link to="/rsvp" className="text-wedding-dark hover:text-wedding-accent transition">אישור הגעה</Link>
            <Link to="/gallery" className="text-wedding-dark hover:text-wedding-accent transition">גלריה</Link>
            <Link to="/location" className="text-wedding-dark hover:text-wedding-accent transition">מיקום האירוע</Link>
            <Link to="/dashboard" className="text-wedding-dark hover:text-wedding-accent transition">ניהול</Link>
            <Button variant="outline" className="border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white">
              כניסת אדמין
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-wedding-dark hover:bg-wedding-light transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-wedding-dark hover:text-wedding-accent"
              onClick={() => setIsOpen(false)}
            >
              דף הבית
            </Link>
            <Link 
              to="/rsvp" 
              className="block py-2 text-wedding-dark hover:text-wedding-accent"
              onClick={() => setIsOpen(false)}
            >
              אישור הגעה
            </Link>
            <Link 
              to="/gallery" 
              className="block py-2 text-wedding-dark hover:text-wedding-accent"
              onClick={() => setIsOpen(false)}
            >
              גלריה
            </Link>
            <Link 
              to="/location" 
              className="block py-2 text-wedding-dark hover:text-wedding-accent"
              onClick={() => setIsOpen(false)}
            >
              מיקום האירוע
            </Link>
            <Link 
              to="/dashboard" 
              className="block py-2 text-wedding-dark hover:text-wedding-accent"
              onClick={() => setIsOpen(false)}
            >
              ניהול
            </Link>
            <Button 
              variant="outline" 
              className="border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white w-full"
              onClick={() => setIsOpen(false)}
            >
              כניסת אדמין
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
