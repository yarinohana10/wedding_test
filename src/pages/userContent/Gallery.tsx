
import React, { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Images, Heart, ChevronDown, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

const Gallery = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    preCeremony: false,
    ceremony: false,
    reception: false
  });

  // State to track user likes
  const [userLikes, setUserLikes] = useState<{[key: number]: boolean}>({});
  
  // State to track upload section
  const [uploadSection, setUploadSection] = useState<'preCeremony' | 'ceremony' | 'reception' | null>(null);
  
  // State for preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Toggle expanded state for a section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample gallery images - in a real app these would come from a database
  const [preCeremonyImages, setPreCeremonyImages] = useState([
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "הכנות לחתונה 1", featured: true, likes: 5 },
    { id: 2, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "הכנות לחתונה 2", featured: true, likes: 3 },
    { id: 3, src: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80", alt: "הכנות לחתונה 3", featured: true, likes: 7 },
    { id: 4, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "הכנות לחתונה 4", featured: true, likes: 2 },
    { id: 5, src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80", alt: "הכנות לחתונה 5", featured: true, likes: 4 },
    { id: 6, src: "https://images.unsplash.com/photo-1595407753234-0882f1e77954?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80", alt: "הכנות לחתונה 6", featured: false, likes: 1 },
    { id: 7, src: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80", alt: "הכנות לחתונה 7", featured: false, likes: 0 },
  ]);

  const [ceremonyImages, setCeremonyImages] = useState([
    { id: 8, src: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "חופה 1", featured: true, likes: 9 },
    { id: 9, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חופה 2", featured: true, likes: 6 },
    { id: 10, src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חופה 3", featured: true, likes: 8 },
    { id: 11, src: "https://images.unsplash.com/photo-1525772764200-be829a350a2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80", alt: "חופה 4", featured: true, likes: 4 },
    { id: 12, src: "https://images.unsplash.com/photo-1501901609772-df0848060b33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", alt: "חופה 5", featured: true, likes: 5 },
  ]);

  const [receptionImages, setReceptionImages] = useState([
    { id: 13, src: "https://images.unsplash.com/photo-1470290378674-419847e9cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "ריקודים 1", featured: true, likes: 7 },
    { id: 14, src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "ריקודים 2", featured: true, likes: 4 },
    { id: 15, src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "ריקודים 3", featured: true, likes: 8 },
    { id: 16, src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "ריקודים 4", featured: true, likes: 5 },
    { id: 17, src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "ריקודים 5", featured: true, likes: 3 },
    { id: 18, src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "ריקודים 6", featured: false, likes: 1 },
    { id: 19, src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", alt: "ריקודים 7", featured: false, likes: 2 },
    { id: 20, src: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", alt: "ריקודים 8", featured: false, likes: 0 },
  ]);

  // Toggle like for an image
  const toggleLike = (section: string, imageId: number) => {
    if (userLikes[imageId]) {
      // Unlike
      setUserLikes(prev => {
        const newLikes = {...prev};
        delete newLikes[imageId];
        return newLikes;
      });
      
      // Update likes count in the appropriate section
      if (section === 'preCeremony') {
        setPreCeremonyImages(prev => 
          prev.map(img => img.id === imageId ? {...img, likes: Math.max(0, img.likes - 1)} : img)
        );
      } else if (section === 'ceremony') {
        setCeremonyImages(prev => 
          prev.map(img => img.id === imageId ? {...img, likes: Math.max(0, img.likes - 1)} : img)
        );
      } else if (section === 'reception') {
        setReceptionImages(prev => 
          prev.map(img => img.id === imageId ? {...img, likes: Math.max(0, img.likes - 1)} : img)
        );
      }
      
      toast({
        title: "הסרת לייק",
        description: "הסרת את הלייק מהתמונה",
      });
    } else {
      // Like
      setUserLikes(prev => ({...prev, [imageId]: true}));
      
      // Update likes count in the appropriate section
      if (section === 'preCeremony') {
        setPreCeremonyImages(prev => 
          prev.map(img => img.id === imageId ? {...img, likes: img.likes + 1} : img)
        );
      } else if (section === 'ceremony') {
        setCeremonyImages(prev => 
          prev.map(img => img.id === imageId ? {...img, likes: img.likes + 1} : img)
        );
      } else if (section === 'reception') {
        setReceptionImages(prev => 
          prev.map(img => img.id === imageId ? {...img, likes: img.likes + 1} : img)
        );
      }
      
      toast({
        title: "הוספת לייק",
        description: "הוספת לייק לתמונה",
      });
    }
  };

  // Handle user image upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadSection || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    const newId = Math.max(
      ...preCeremonyImages.map(img => img.id),
      ...ceremonyImages.map(img => img.id),
      ...receptionImages.map(img => img.id)
    ) + 1;
    
    const newImage = {
      id: newId,
      src: imageUrl,
      alt: `תמונה שהועלתה ${newId}`,
      featured: false,
      likes: 0
    };
    
    if (uploadSection === 'preCeremony') {
      setPreCeremonyImages(prev => [...prev, newImage]);
    } else if (uploadSection === 'ceremony') {
      setCeremonyImages(prev => [...prev, newImage]);
    } else if (uploadSection === 'reception') {
      setReceptionImages(prev => [...prev, newImage]);
    }
    
    toast({
      title: "התמונה הועלתה בהצלחה",
      description: "תודה על השיתוף!",
    });
    
    setUploadSection(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open image preview
  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
  };

  // Filter featured images for the carousel
  const getFeaturedImages = (images: typeof preCeremonyImages) => {
    return images.filter(img => img.featured).slice(0, 5);
  };

  // Render image carousel for a section
  const renderCarousel = (images: typeof preCeremonyImages) => {
    const featuredImages = getFeaturedImages(images);
    
    return (
      <Carousel 
        className="w-full max-w-3xl mx-auto"
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {featuredImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="p-1 h-64 md:h-96">
                <div 
                  className="relative h-full w-full overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openPreview(image.src)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-all hover:scale-105 duration-500"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={isMobile ? "left-2" : "-left-12"} />
        <CarouselNext className={isMobile ? "right-2" : "-right-12"} />
      </Carousel>
    );
  };

  // Render expanded gallery grid with fade effect
  const renderGalleryGrid = (images: typeof preCeremonyImages, section: string) => {
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
              <div className="relative h-full w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  onClick={() => openPreview(image.src)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div 
                    className={`absolute bottom-2 right-2 flex items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 cursor-pointer ${userLikes[image.id] ? 'text-wedding-primary' : 'text-gray-500'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(section, image.id);
                    }}
                  >
                    <Heart 
                      className="h-5 w-5 ml-1" 
                      fill={userLikes[image.id] ? "currentColor" : "none"} 
                    />
                    <span className="text-xs font-medium">{image.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {hasMoreImages && !expandedSections[section as keyof typeof expandedSections] && (
          <div className="relative mt-4">
            <div 
              className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none"
              style={{ transform: 'rotate(180deg)' }}
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
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    onClick={() => openPreview(image.src)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div 
                      className={`absolute bottom-2 right-2 flex items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 cursor-pointer ${userLikes[image.id] ? 'text-wedding-primary' : 'text-gray-500'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(section, image.id);
                      }}
                    >
                      <Heart 
                        className="h-5 w-5 ml-1" 
                        fill={userLikes[image.id] ? "currentColor" : "none"} 
                      />
                      <span className="text-xs font-medium">{image.likes}</span>
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
    images: typeof preCeremonyImages,
    sectionKey: keyof typeof expandedSections
  ) => {
    // If no images or fewer than required, don't show section
    if (!images.length) {
      return null;
    }

    return (
      <section className="mb-16">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        {renderCarousel(images)}
        
        <div className="mt-6 flex justify-center gap-4">          
          <Button
            onClick={() => setUploadSection(sectionKey as any)}
            className="bg-wedding-primary text-white rounded-full px-6 py-2 flex items-center gap-2 hover:bg-wedding-accent transition-colors"
          >
            <Upload className="h-4 w-4 ml-2" />
            <span>העלאת תמונה</span>
          </Button>
        </div>
        
        {renderGalleryGrid(images, sectionKey)}
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
              <p className="text-gray-600 mb-8">רגעים מיוחדים שאנחנו רוצים לשתף איתכם</p>
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 bg-white/50 rounded-lg p-4 shadow-sm">
                  סיפור החתונה שלנו דרך תמונות מרגשות - מהרגעים הראשונים של ההכנות, דרך טקס החופה המרגש ועד לחגיגה הגדולה על רחבת הריקודים.
                  <br />
                  <strong>גם אתם מוזמנים להעלות תמונות ולשתף רגעים מהאירוע!</strong>
                </p>
              </div>
            </div>

            {renderSection(
              "לפני האירוע",
              "הרגעים המרגשים לפני הטקס",
              preCeremonyImages,
              "preCeremony"
            )}
            
            {renderSection(
              "טקס החופה",
              "רגעי הטקס המרגשים",
              ceremonyImages,
              "ceremony"
            )}
            
            {renderSection(
              "רחבת הריקודים",
              "החגיגה הגדולה",
              receptionImages,
              "reception"
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
        <Dialog open={!!uploadSection} onOpenChange={() => setUploadSection(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">סגור</span>
            </DialogClose>
            <DialogHeader className="flex">
              <DialogTitle className="flex-1 text-right">העלאת תמונה</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="text-center">
                <p className="mb-4">בחר תמונה להעלאה ל
                  {uploadSection === 'preCeremony' ? ' לפני האירוע' : 
                  uploadSection === 'ceremony' ? ' טקס החופה' : ' רחבת הריקודים'}
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-wedding-primary text-white hover:bg-wedding-accent"
                >
                  <Upload className="h-4 w-4 ml-2" />
                  <span>בחר תמונה</span>
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
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
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
