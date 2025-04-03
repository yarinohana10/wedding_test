
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from "lucide-react";
import { defaultWeddingData } from "./Index";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || isOpen
          ? "bg-white shadow-md text-gray-800"
          : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div
            className={`font-extrabold text-lg md:text-xl ${
              scrolled ? "text-wedding-primary" : ""
            }`}
          >
            {defaultWeddingData.coupleName}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8 space-x-reverse">
            <Link
              to="/"
              className={`hover:text-wedding-primary ${
                location.pathname === "/"
                  ? "text-wedding-primary font-medium"
                  : ""
              }`}
            >
              דף הבית
            </Link>
            <Link
              to="/gallery"
              className={`hover:text-wedding-primary ${
                location.pathname === "/gallery"
                  ? "text-wedding-primary font-medium"
                  : ""
              }`}
            >
              גלריה
            </Link>
            <Link
              to="/location"
              className={`hover:text-wedding-primary ${
                location.pathname === "/location"
                  ? "text-wedding-primary font-medium"
                  : ""
              }`}
            >
              מיקום האירוע
            </Link>
            <Link
              to="/gift"
              className={`hover:text-wedding-primary ${
                location.pathname === "/gift"
                  ? "text-wedding-primary font-medium"
                  : ""
              }`}
            >
              מתנה
            </Link>
          </div>

          {/* Admin button */}
          <Link to="/dashboard" className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                scrolled ? "text-gray-800" : "text-white hover:text-white"
              }`}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            {isOpen ? (
              <X
                className={`h-6 w-6 ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-white text-gray-800 text-center">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`py-2 ${
                  location.pathname === "/" ? "text-wedding-primary" : ""
                }`}
              >
                דף הבית
              </Link>
              <Link
                to="/gallery"
                className={`py-2 ${
                  location.pathname === "/gallery" ? "text-wedding-primary" : ""
                }`}
              >
                גלריה
              </Link>
              <Link
                to="/location"
                className={`py-2 ${
                  location.pathname === "/location"
                    ? "text-wedding-primary"
                    : ""
                }`}
              >
                מיקום
              </Link>
              <Link
                to="/gift"
                className={`py-2 ${
                  location.pathname === "/gift" ? "text-wedding-primary" : ""
                }`}
              >
                מתנה
              </Link>
              <Link
                to="/dashboard"
                className={`py-2 ${
                  location.pathname.includes("/dashboard")
                    ? "text-wedding-primary"
                    : ""
                }`}
              >
                ניהול
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
