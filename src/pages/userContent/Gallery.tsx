
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { Images, Heart, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { 
  fetchPhotosByCategory, 
  uploadPhoto, 
  ratePhoto,
  type Photo, 
  type PhotoCategory 
} from "@/services/photoService";

const Gallery = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to track photos
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({
    preCeremony: [],
    ceremony: [],
    reception: []
  });

  // State to track loading state
  const [loading, setLoading] = useState(true);

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    preCeremony: false,
    ceremony: false,
    reception: false,
  });

  // State to track user likes
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});

  // State to track upload section
  const [uploadSection, setUploadSection] = useState<PhotoCategory | null>(null);
  const [uploading, setUploading] = useState(false);

  // State for preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load photos on component mount
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

        // Initialize likes from local storage if available
        const savedLikes = localStorage.getItem('galleryLikes');
        if (savedLikes) {
          setUserLikes(JSON.parse(savedLikes));
        }
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

  // Toggle expanded state for a section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle like for an image
  const toggleLike = async (section: string, photoId: string) => {
    try {
      const isLiked = !!userLikes[photoId];
      
      // Toggle like in state
      setUserLikes(prev => {
        const newLikes = { ...prev };
        if (isLiked) {
          delete newLikes[photoId];
        } else {
          newLikes[photoId] = true;
        }
        
        // Save likes to local storage
        localStorage.setItem('galleryLikes', JSON.stringify(newLikes));
        return newLikes;
      });
      
      // Update likes in database
      const currentPhoto = photos[section].find(p => p.id === photoId);
      if (currentPhoto) {
        const newRating = isLiked 
          ? Math.max(0, currentPhoto.rating - 1) 
          : currentPhoto.rating + 1;
          
        // Update in database
        await ratePhoto(photoId, newRating);
        
        // Update local state
        setPhotos(prev => {
          const newPhotos = { ...prev };
          newPhotos[section] = newPhotos[section].map(photo => 
            photo.id === photoId ? { ...photo, rating: newRating } : photo
          );
          return newPhotos;
        });
      }
      
      toast({
        title: isLiked ? "הסרת לייק" : "הוספת לייק",
        description: isLiked ? "הסרת את הלייק מהתמונה" : "הוספת לייק לתמונה",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "שגיאה בעדכון הלייק",
        description: "אירעה שגיאה בעת עדכון הלייק. נסה שנית.",
        variant: "destructive",
      });
    }
  };

  // Handle user image upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadSection || !e.target.files || e.target.files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      const file = e.target.files[0];
      
      // Upload to Supabase
      const newPhoto = await uploadPhoto(file, uploadSection);
      
      // Update local state
      setPhotos(prev => ({
        ...prev,
        [uploadSection]: [...prev[uploadSection], newPhoto]
      }));
      
      toast({
        title: "התמונה הועלתה בהצלחה",
        description: "תודה על השיתוף!",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "שגיאה בהעלאת התמונה",
        description: "אירעה שגיאה בעת העלאת התמונה. נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadSection(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Open image preview
  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
  };

  // Filter featured images for the carousel
  const getFeaturedImages = (images: Photo[]) => {
    return images.filter((img) => img.featured).slice(0, 5);
  };

  // Render image carousel for a section
  const renderCarousel = (images: Photo[]) => {
    const featuredImages = getFeaturedImages(images);

    if (featuredImages.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">אין תמונות מודגשות בקטגוריה זו</p>
        </div>
      );
    }

    return (
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {featuredImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="p-1 h-64 md:h-96">
                <div
                  className="relative h-full w-full overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openPreview(image.path)}
                >
                  <img
                    src={image.path}
                    alt={image.description || "תמונת חתונה"}
                    className="h-full w-full object-cover transition-all hover:scale-105 duration-500"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={"md:left-2 bg:left-12"} />
        <CarouselNext className={"md:right-2 bg:right-12"} />
      </Carousel>
    );
  };

  // Render expanded gallery grid with fade effect
  const renderGalleryGrid = (
    images: Photo[],
    section: string
  ) => {
    const visibleImages = images.slice(0, 8); // Show only first 8 images
    const hasMoreImages = images.length > 8;

    return (
      <div className="mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div
                onClick={() => openPreview(image.path)}
                className="relative h-full w-full"
              >
                <img
                  src={image.path}
                  alt={image.description || "תמונת גלריה"}
                  className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div
                    className={`absolute bottom-2 right-2 flex items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 cursor-pointer ${
                      userLikes[image.id]
                        ? "text-wedding-primary"
                        : "text-gray-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(section, image.id);
                    }}
                  >
                    <Heart
                      className="h-5 w-5 ml-1"
                      fill={userLikes[image.id] ? "currentColor" : "none"}
                    />
                    <span className="text-xs font-medium">{image.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMoreImages &&
          !expandedSections[section as keyof typeof expandedSections] && (
            <div className="relative mt-4">
              <div
                className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none"
                style={{ transform: "rotate(180deg)" }}
              />
              <div className="text-center pt-6">
                <Button
                  onClick={() => toggleSection(section as keyof typeof expandedSections)}
                  variant="outline"
                  className="bg-white shadow hover:shadow-md rounded-full px-6 py-2 mt-2"
                >
                  הצג את כל {images.length} התמונות
                </Button>
              </div>
            </div>
          )}

        {expandedSections[section as keyof typeof expandedSections] && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {images.slice(8).map((image) => (
              <div
                key={image.id}
                className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-full w-full">
                  <img
                    src={image.path}
                    alt={image.description || "תמונת גלריה"}
                    className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    onClick={() => openPreview(image.path)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div
                      className={`absolute bottom-2 right-2 flex items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 cursor-pointer ${
                        userLikes[image.id]
                          ? "text-wedding-primary"
                          : "text-gray-500"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(section, image.id);
                      }}
                    >
                      <Heart
                        className="h-5 w-5 ml-1"
                        fill={userLikes[image.id] ? "currentColor" : "none"}
                      />
                      <span className="text-xs font-medium">{image.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {expandedSections[section as keyof typeof expandedSections] && (
          <div className="text-center mt-4">
            <Button
              onClick={() => toggleSection(section as keyof typeof expandedSections)}
              variant="outline"
              className="bg-white shadow hover:shadow-md rounded-full px-6 py-2"
            >
              הסתר
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render a gallery section
  const renderSection = (
    title: string,
    subtitle: string,
    sectionImages: Photo[],
    sectionKey: string
  ) => {
    // If no images, don't show section
    if (!sectionImages.length) {
      return null;
    }

    return (
      <section className="mb-16">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {renderCarousel(sectionImages)}

        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={() => setUploadSection(sectionKey as PhotoCategory)}
            className="bg-wedding-primary text-white rounded-full px-6 py-2 flex items-center gap-2 hover:bg-wedding-accent transition-colors"
          >
            <Upload className="h-4 w-4 ml-2" />
            <span>העלאת תמונה</span>
          </Button>
        </div>

        {renderGalleryGrid(sectionImages, sectionKey)}
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">הגלריה שלנו</h1>
                <Images className="text-wedding-primary mr-2" size={28} />
              </div>
              <p className="text-gray-600 mb-8">
                רגעים מיוחדים שאנחנו רוצים לשתף איתכם
              </p>
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 bg-white/50 rounded-lg p-4 shadow-sm">
                  סיפור החתונה שלנו דרך תמונות מרגשות - מהרגעים הראשונים של
                  ההכנות, דרך טקס החופה המרגש ועד לחגיגה הגדולה על רחבת
                  הריקודים.
                  <br />
                  <strong>
                    גם אתם מוזמנים להעלות תמונות ולשתף רגעים מהאירוע!
                  </strong>
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-wedding-primary" />
                <span className="mr-3 text-lg">טוען את הגלריה...</span>
              </div>
            ) : (
              <>
                {renderSection(
                  "לפני האירוע",
                  "הרגעים המרגשים לפני הטקס",
                  photos.preCeremony,
                  "preCeremony"
                )}

                {renderSection(
                  "טקס החופה",
                  "רגעי הטקס המרגשים",
                  photos.ceremony,
                  "ceremony"
                )}

                {renderSection(
                  "רחבת הריקודים",
                  "החגיגה הגדולה",
                  photos.reception,
                  "reception"
                )}

                {photos.preCeremony.length === 0 && 
                  photos.ceremony.length === 0 && 
                  photos.reception.length === 0 && (
                    <div className="text-center py-12 bg-white/50 rounded-lg shadow-sm">
                      <Images className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">אין תמונות עדיין</h3>
                      <p className="text-gray-500 mb-6">
                        היה הראשון להעלות תמונות לגלריה!
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={() => setUploadSection("preCeremony")}
                          className="bg-wedding-primary text-white"
                        >
                          <Upload className="h-4 w-4 ml-2" />
                          <span>העלה תמונה</span>
                        </Button>
                      </div>
                    </div>
                  )
                }
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
      />

      {/* Upload dialog */}
      {uploadSection && (
        <Dialog
          open={!!uploadSection}
          onOpenChange={() => !uploading && setUploadSection(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogClose 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              disabled={uploading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">סגור</span>
            </DialogClose>
            <DialogHeader className="flex">
              <DialogTitle className="flex-1 text-right">
                העלאת תמונה
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="text-center">
                <p className="mb-4">
                  בחר תמונה להעלאה ל
                  {uploadSection === "preCeremony"
                    ? " לפני האירוע"
                    : uploadSection === "ceremony"
                    ? " טקס החופה"
                    : " רחבת הריקודים"}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-wedding-primary text-white hover:bg-wedding-accent"
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 ml-2" />
                  )}
                  <span>{uploading ? "מעלה..." : "בחר תמונה"}</span>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  מקסימום 5MB, פורמטים: JPG, PNG
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image preview dialog */}
      {previewImage && (
        <Dialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
        >
          <DialogContent className="sm:max-w-3xl p-1 bg-black/80">
            <DialogClose className="absolute right-4 top-4 rounded-full bg-white/20 p-1 z-10">
              <X className="h-5 w-5 text-white" />
              <span className="sr-only">סגור</span>
            </DialogClose>
            <div className="flex items-center justify-center h-[80vh]">
              <img
                src={previewImage}
                alt="תצוגה מקדימה"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;
