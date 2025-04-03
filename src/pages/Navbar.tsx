
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { signOut } from "@/utils/authUtils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // The AuthContext will handle navigation and toast
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="shadow-sm bg-white fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center text-wedding-primary font-bold text-xl">
                <Heart className="h-5 w-5 mr-1 fill-current text-wedding-primary" />
                <span>Wedding</span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 rtl:space-x-reverse">
              <Link
                to="/"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2",
                  isActive("/")
                    ? "border-wedding-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                ראשי
              </Link>
              <Link
                to="/gallery"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2",
                  isActive("/gallery")
                    ? "border-wedding-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                גלריה
              </Link>
              <Link
                to="/location"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2",
                  isActive("/location")
                    ? "border-wedding-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                מיקום
              </Link>
              <Link
                to="/gift"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2",
                  isActive("/gift")
                    ? "border-wedding-primary text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                מתנות
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2",
                      isActive("/dashboard")
                        ? "border-wedding-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    ניהול
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleLogout}
                  >
                    התנתק
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  התחברות
                </Link>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-wedding-primary"
            >
              <span className="sr-only">פתח תפריט</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 text-right">
            <Link
              to="/"
              className={cn(
                "block pl-3 pr-4 py-2 border-r-4",
                isActive("/")
                  ? "border-wedding-primary text-wedding-primary bg-wedding-light"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              ראשי
            </Link>
            <Link
              to="/gallery"
              className={cn(
                "block pl-3 pr-4 py-2 border-r-4",
                isActive("/gallery")
                  ? "border-wedding-primary text-wedding-primary bg-wedding-light"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              גלריה
            </Link>
            <Link
              to="/location"
              className={cn(
                "block pl-3 pr-4 py-2 border-r-4",
                isActive("/location")
                  ? "border-wedding-primary text-wedding-primary bg-wedding-light"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              מיקום
            </Link>
            <Link
              to="/gift"
              className={cn(
                "block pl-3 pr-4 py-2 border-r-4",
                isActive("/gift")
                  ? "border-wedding-primary text-wedding-primary bg-wedding-light"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setIsOpen(false)}
            >
              מתנות
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "block pl-3 pr-4 py-2 border-r-4",
                    isActive("/dashboard")
                      ? "border-wedding-primary text-wedding-primary bg-wedding-light"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  ניהול
                </Link>
                <button
                  className="block w-full text-right pl-3 pr-4 py-2 border-r-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  התנתק
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 border-r-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                התחברות
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
