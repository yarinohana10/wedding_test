import { Button } from "@/components/ui/button";
import { Heart, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GoToGallery = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center  m-8 mt-14 shadow-lg py-16 bg-white rounded-lg">
      <div className="flex justify-center mb-4">
        <Heart className="text-wedding-primary ml-2" fill="currentColor" />
      </div>
      <h2 className="text-2xl font-bold mb-4">הצטרפו לחגיגה שלנו</h2>
      <p className="text-gray-600 mb-6">
        צפו בתמונות שלנו ושתפו את הרגעים המיוחדים שלכם. אתם מוזמנים להעלות
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
  );
};

export default GoToGallery;
