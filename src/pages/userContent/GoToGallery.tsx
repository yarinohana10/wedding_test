import { Button } from "@/components/ui/button";
import { Heart, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GoToGallery = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-wedding-light text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg p-8 shadow-md">
          <div className="flex justify-center mb-4">
            <Heart className="text-wedding-primary ml-2" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold mb-4">הצטרפו לחגיגה שלנו</h2>
          <p className="text-gray-600 mb-6">
            צפו בתמונות שלנו וחלקו את הרגעים המיוחדים שלכם. אתם מוזמנים להעלות
            תמונות משלכם!
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/gallery")}
            className="bg-white border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white transition-colors flex items-center gap-3 mx-auto"
          >
            <Image className="h-5 w-5 ml-2" />
            <span>צפו בגלריה שלנו</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GoToGallery;
