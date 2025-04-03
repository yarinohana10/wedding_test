
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ExternalLink, Heart, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchPhotosByCategory, 
  uploadPhoto, 
  deletePhoto, 
  togglePhotoFeatured,
  type Photo, 
  type PhotoCategory 
} from "@/services/photoService";

const GalleryManager: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<PhotoCategory | null>(null);
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({
    preCeremony: [],
    ceremony: [],
    reception: []
  });

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        
        // Load photos for each category
        const preCeremonyPhotos = await fetchPhotosByCategory("preCeremony");
        const ceremonyPhotos = await fetchPhotosByCategory("ceremony");
        const receptionPhotos = await fetchPhotosByCategory("reception");
        
        setPhotos({
          preCeremony: preCeremonyPhotos,
          ceremony: ceremonyPhotos,
          reception: receptionPhotos
        });
      } catch (error) {
        console.error("Error loading photos:", error);
        toast({
          title: "שגיאה בטעינת התמונות",
          description: "אירעה שגיאה בעת טעינת תמונות הגלריה",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [toast]);

  const handleGalleryImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: PhotoCategory
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    try {
      setUploading(category);
      const file = e.target.files[0];
      
      // Upload photo to Supabase
      const newPhoto = await uploadPhoto(file, category);
      
      // Update local state
      setPhotos(prev => ({
        ...prev,
        [category]: [...prev[category as keyof typeof prev], newPhoto]
      }));
      
      toast({
        title: "התמונה הועלתה בהצלחה",
        description: "התמונה נוספה לגלריה"
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "שגיאה בהעלאת התמונה",
        description: "אירעה שגיאה בעת העלאת התמונה. נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
      // Reset input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleToggleFeatured = async (imageId: string, featured: boolean) => {
    try {
      // Update in Supabase
      await togglePhotoFeatured(imageId, featured);
      
      // Update local state
      setPhotos(prev => {
        const newPhotos = { ...prev };
        for (const category in newPhotos) {
          newPhotos[category] = newPhotos[category].map(photo => 
            photo.id === imageId ? { ...photo, featured } : photo
          );
        }
        return newPhotos;
      });
      
      toast({
        title: featured ? "התמונה סומנה כמודגשת" : "התמונה כבר לא מודגשת",
        description: "סטטוס התמונה עודכן בהצלחה",
      });
    } catch (error) {
      console.error("Error toggling photo featured status:", error);
      toast({
        title: "שגיאה בעדכון התמונה",
        description: "אירעה שגיאה בעת עדכון סטטוס התמונה. נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      // Delete from Supabase
      await deletePhoto(imageId);
      
      // Update local state
      setPhotos(prev => {
        const newPhotos = { ...prev };
        for (const category in newPhotos) {
          newPhotos[category] = newPhotos[category]
            .filter(photo => photo.id !== imageId);
        }
        return newPhotos;
      });
      
      toast({
        title: "התמונה נמחקה",
        description: "התמונה הוסרה מהגלריה בהצלחה",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "שגיאה במחיקת התמונה",
        description: "אירעה שגיאה בעת מחיקת התמונה. נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    if (sourceCategory === destCategory) {
      // Reordering within the same category - we don't actually need to do anything
      // as we're not tracking order in the database yet
      const reorderedPhotos = Array.from(photos[sourceCategory]);
      const [removed] = reorderedPhotos.splice(source.index, 1);
      reorderedPhotos.splice(destination.index, 0, removed);

      setPhotos(prev => ({
        ...prev,
        [sourceCategory]: reorderedPhotos
      }));
    }
  };

  const renderCategorySection = (
    title: string,
    category: string
  ) => (
    <div className="border p-3 rounded-lg">
      <h4 className="font-medium mb-3 text-center">{title}</h4>
      <div className="flex justify-center mb-3">
        <label
          htmlFor={`${category}-upload`}
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
        >
          {uploading === category as PhotoCategory ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span>העלאת תמונות</span>
        </label>
        <input
          id={`${category}-upload`}
          type="file"
          accept="image/*"
          onChange={(e) => handleGalleryImagesChange(e, category as PhotoCategory)}
          className="hidden"
          disabled={!!uploading}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={category}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 min-h-[200px]"
            >
              {photos[category].map((photo, index) => (
                <Draggable
                  key={photo.id}
                  draggableId={photo.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex bg-white p-2 rounded-md border shadow-sm"
                    >
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={photo.path}
                          alt={photo.description || `תמונה ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col mr-2 text-right">
                        <div className="text-sm truncate">
                          {photo.description || `תמונה ${index + 1}`}
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <Button
                            onClick={() => handleToggleFeatured(photo.id, !photo.featured)}
                            variant={photo.featured ? "default" : "outline"}
                            size="sm"
                            className="h-7 px-1 flex-1"
                          >
                            <Heart
                              className="h-3 w-3 ml-1"
                              fill={photo.featured ? "currentColor" : "none"}
                            />
                            {photo.featured ? "מודגשת" : "לא מודגשת"}
                          </Button>
                          <Button
                            onClick={() => handleDeleteImage(photo.id)}
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive"
                          >
                            <span className="sr-only">מחק</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3">טוען גלריה...</span>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        <span>ניהול גלריית תמונות</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 mr-2"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        העלה תמונות לגלריה וארגן אותן לפי קטגוריות. גרור תמונות לסידור
        מחדש וסמן עם לב כדי שיופיעו בקרוסלה.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {renderCategorySection("לפני האירוע", "preCeremony")}
        {renderCategorySection("חופה", "ceremony")}
        {renderCategorySection("רחבת ריקודים", "reception")}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => window.open("/gallery", "_blank")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          <span>צפה בגלריה</span>
        </Button>
      </div>
    </div>
  );
};

export default GalleryManager;
