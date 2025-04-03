import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { weddingData } from "./Index";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart
                className="text-wedding-primary h-5 w-5 ml-2"
                fill="currentColor"
              />
              <span>{weddingData.coupleName}</span>
            </h3>
            <p className="text-gray-300 text-sm">
              אתר החתונה שלנו נוצר כדי לחלוק את השמחה עם המשפחה והחברים. אנו
              מודים לכם על שאתם חלק מהיום המיוחד שלנו.
            </p>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-wedding-primary transition-colors"
                >
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-300 hover:text-wedding-primary transition-colors"
                >
                  גלריה
                </Link>
              </li>
              <li>
                <Link
                  to="/location"
                  className="text-gray-300 hover:text-wedding-primary transition-colors"
                >
                  מיקום האירוע
                </Link>
              </li>
              <li>
                <Link
                  to="/gift"
                  className="text-gray-300 hover:text-wedding-primary transition-colors"
                >
                  השאירו מתנה
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">צרו קשר</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start">
                <Phone className="h-5 w-5 ml-2" />
                <span className="text-gray-300">054-1234567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <Mail className="h-5 w-5 ml-2" />
                <span className="text-gray-300">couple@wedding.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <MapPin className="h-5 w-5 ml-2" />
                <span className="text-gray-300">רחוב הפרחים 123, תל אביב</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2023 weddingJoy כל הזכויות שמורות.
            </p>
          </div>

          <div className="flex space-x-4 space-x-reverse">
            <Link
              to="/terms"
              className="text-gray-400 text-sm hover:text-wedding-primary transition-colors"
            >
              תקנון
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 text-sm hover:text-wedding-primary transition-colors"
            >
              פרטיות
            </Link>
            <Link
              to="/accessibility"
              className="text-gray-400 text-sm hover:text-wedding-primary transition-colors"
            >
              נגישות
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
