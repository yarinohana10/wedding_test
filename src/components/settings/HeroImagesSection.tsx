
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Images, Upload } from "lucide-react";

interface HeroImagesSectionProps {
  previewHeroImages: string[];
  handleHeroImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveHeroImages: () => void;
}

const HeroImagesSection: React.FC<HeroImagesSectionProps> = ({
  previewHeroImages,
  handleHeroImagesChange,
  handleSaveHeroImages,
}) => {
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
          multiple
          onChange={handleHeroImagesChange}
        />
      </div>

      {previewHeroImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {previewHeroImages.map((src, index) => (
            <div
              key={index}
              className="aspect-video relative rounded-md overflow-hidden"
            >
              <img
                src={src}
                alt={`תמונה ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleSaveHeroImages}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4 ml-2" />
        <span>העלה תמונות</span>
      </Button>
    </div>
  );
};

export default HeroImagesSection;
