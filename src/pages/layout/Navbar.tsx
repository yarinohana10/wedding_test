
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Gift } from 'lucide-react';
import { weddingData } from '@/pages/Index';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinkClasses = "px-3 py-2 text-gray-600 hover:text-wedding-primary transition-colors";
  const activeNavLinkClasses = "text-wedding-primary font-medium";

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className={`h-6 w-6 ${isScrolled ? 'text-wedding-primary' : 'text-white'}`} fill="currentColor" />
              <span className={`font-bold text-lg mr-2 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                {weddingData.coupleName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} ${isScrolled ? '' : 'text-white hover:text-white/80'}`
              }
              end
            >
              דף הבית
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} ${isScrolled ? '' : 'text-white hover:text-white/80'}`
              }
            >
              גלריה
            </NavLink>
            <NavLink
              to="/location"
              className={({ isActive }) =>
                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} ${isScrolled ? '' : 'text-white hover:text-white/80'}`
              }
            >
              מיקום
            </NavLink>
            <div className="mx-2">
              <Button
                asChild
                variant={isScrolled ? "default" : "secondary"}
                className={`bg-wedding-primary text-white hover:bg-wedding-accent flex items-center gap-3 ${!isScrolled && "border border-white"}`}
              >
                <Link to="/gift">
                  <Gift className="h-4 w-4" />
                  <span>השאירו מתנה</span>
                </Link>
              </Button>
            </div>
            <Button
              asChild
              variant="outline"
              className={isScrolled ? "bg-white text-gray-800 border-gray-300" : "bg-transparent text-white border-white hover:bg-white/20"}
            >
              <Link to="/login">
                התחברות
              </Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="icon"
              className={isScrolled ? "text-gray-800" : "text-white"}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <Heart className="h-6 w-6 text-wedding-primary" fill="currentColor" />
                <span className="font-bold text-lg mr-2 text-gray-800">
                  דנה & יוסי
                </span>
              </Link>
              <Button onClick={toggleMenu} variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <nav className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-lg py-2 ${isActive ? 'text-wedding-primary font-medium' : 'text-gray-800'}`
                }
                onClick={() => setIsMenuOpen(false)}
                end
              >
                דף הבית
              </NavLink>
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `text-lg py-2 ${isActive ? 'text-wedding-primary font-medium' : 'text-gray-800'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                גלריה
              </NavLink>
              <NavLink
                to="/location"
                className={({ isActive }) =>
                  `text-lg py-2 ${isActive ? 'text-wedding-primary font-medium' : 'text-gray-800'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                מיקום
              </NavLink>
              <Link
                to="/gift"
                className="text-lg py-2 text-wedding-primary font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gift className="h-5 w-5" />
                <span>השאירו מתנה</span>
              </Link>
              <Link
                to="/login"
                className="text-lg py-2 text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                התחברות
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
