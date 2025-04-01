
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Images, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

const Gallery = () => {
  const isMobile = useIsMobile();
  
  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    preCeremony: false,
    ceremony: false,
    reception: false
  });

  // Toggle expanded state for a section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample gallery images - in a real app these would come from a database
  const preCeremonyImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "הכנות לחתונה 1", featured: true },
    { id: 2, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "הכנות לחתונה 2", featured: true },
    { id: 3, src: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80", alt: "הכנות לחתונה 3", featured: true },
    { id: 4, src: "https://images.unsplash.com/photo-1529636798458-92182e662485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "הכנות לחתונה 4", featured: true },
    { id: 5, src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80", alt: "הכנות לחתונה 5", featured: true },
    { id: 6, src: "https://images.unsplash.com/photo-1595407753234-0882f1e77954?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80", alt: "הכנות לחתונה 6", featured: false },
    { id: 7, src: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80", alt: "הכנות לחתונה 7", featured: false },
  ];

  const ceremonyImages = [
    { id: 8, src: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "חופה 1", featured: true },
    { id: 9, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חופה 2", featured: true },
    { id: 10, src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חופה 3", featured: true },
    { id: 11, src: "https://images.unsplash.com/photo-1525772764200-be829a350a2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80", alt: "חופה 4", featured: true },
    { id: 12, src: "https://images.unsplash.com/photo-1501901609772-df0848060b33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", alt: "חופה 5", featured: true },
  ];

  const receptionImages = [
    { id: 13, src: "https://images.unsplash.com/photo-1470290378674-419847e9cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "ריקודים 1", featured: true },
    { id: 14, src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "ריקודים 2", featured: true },
    { id: 15, src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "ריקודים 3", featured: true },
    { id: 16, src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "ריקודים 4", featured: true },
    { id: 17, src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "ריקודים 5", featured: true },
    { id: 18, src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "ריקודים 6", featured: false },
    { id: 19, src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", alt: "ריקודים 7", featured: false },
    { id: 20, src: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", alt: "ריקודים 8", featured: false },
  ];

  // Filter featured images for the carousel
  const getFeaturedImages = (images: typeof preCeremonyImages) => {
    return images.filter(img => img.featured).slice(0, 5);
  };

  // Render image carousel for a section
  const renderCarousel = (images: typeof preCeremonyImages) => {
    const featuredImages = getFeaturedImages(images);
    
    return (
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {featuredImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="p-1 h-64 md:h-96">
                <div className="relative h-full w-full overflow-hidden rounded-xl">
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

  // Render expanded gallery grid
  const renderGalleryGrid = (images: typeof preCeremonyImages) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div className="relative h-full w-full">
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Heart className="text-white h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
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
    const isExpanded = expandedSections[sectionKey];
    
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
        
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => toggleSection(sectionKey)}
            className="group"
          >
            {isExpanded ? (
              <>
                <span className="ml-2">הסתר תמונות</span>
                <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
              </>
            ) : (
              <>
                <span className="ml-2">הצג הכל</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </>
            )}
          </Button>
        </div>
        
        {isExpanded && renderGalleryGrid(images)}
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
                <Images className="text-wedding-primary mr-2" size={28} />
                <h1 className="text-3xl md:text-4xl font-bold">הגלריה שלנו</h1>
              </div>
              <p className="text-gray-600 mb-8">רגעים מיוחדים שאנחנו רוצים לשתף איתכם</p>
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 bg-white/50 rounded-lg p-4 shadow-sm">
                  סיפור החתונה שלנו דרך תמונות מרגשות - מהרגעים הראשונים של ההכנות, דרך טקס החופה המרגש ועד לחגיגה הגדולה על רחבת הריקודים.
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
    </div>
  );
};

export default Gallery;
