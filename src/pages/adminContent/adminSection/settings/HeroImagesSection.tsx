
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Images, Upload, X } from "lucide-react";
import { uploadHeroImage, removeHeroImage } from "@/services/eventSettingsService";
import { useToast } from "@/hooks/use-toast";

interface HeroImagesSectionProps {
  previewHeroImages: string[];
  setPreviewHeroImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const HeroImagesSection: React.FC<HeroImagesSectionProps> = ({
  previewHeroImages,
  setPreviewHeroImages
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      const file = e.target.files[0];
      const imageUrl = await uploadHeroImage(file);
      
      // Update local state
      setPreviewHeroImages(prev => [...prev, imageUrl]);
      
      toast({
        title: "התמונה הועלתה בהצלחה",
        description: "התמונה נוספה לקרוסלה בדף הבית",
      });
    } catch (error) {
      console.error("Error uploading hero image:", error);
      toast({
        title: "שגיאה בהעלאת התמונה",
        description: "אירעה שגיאה בעת העלאת התמונה. נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input value
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      await removeHeroImage(imageUrl);
      
      // Update local state
      setPreviewHeroImages(prev => prev.filter(img => img !== imageUrl));
      
      toast({
        title: "התמונה הוסרה בהצלחה",
        description: "התמונה הוסרה מהקרוסלה בדף הבית",
      });
    } catch (error) {
      console.error("Error removing hero image:", error);
      toast({
        title: "שגיאה בהסרת התמונה",
        description: "אירעה שגיאה בעת הסרת התמונה. נסה שנית.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md mt-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <span>תמונות כותרת ראשית</span>
        <Images className="h-4 w-4 mr-2" />
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        העלה תמונות שיופיעו בקרוסלה בחלק העליון של דף הבית. מומלץ
        תמונות באיכות גבוהה ביחס רוחב-גובה של 16:9.
      </p>

      <div className="mb-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleHeroImageUpload}
          disabled={uploading}
        />
      </div>

      {previewHeroImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {previewHeroImages.map((src, index) => (
            <div
              key={index}
              className="aspect-video relative rounded-md overflow-hidden group"
            >
              <img
                src={src}
                alt={`תמונה ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => handleRemoveImage(src)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroImagesSection;
