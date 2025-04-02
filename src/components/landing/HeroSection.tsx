
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  coupleName: string;
  date: string;
  heroImages?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  coupleName,
  date,
  heroImages = ["https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"]
}) => {
  const navigate = useNavigate();
  
  const scrollToRsvp = () => {
    const rsvpElement = document.getElementById('rsvp-section');
    if (rsvpElement) {
      rsvpElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Image Carousel with Overlay */}
      <div className="absolute inset-0 z-0">
        <Carousel 
          opts={{
            loop: true,
            duration: 60,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full w-full transition-opacity duration-1000"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center p-6 max-w-3xl animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-heebo">
          {coupleName}
        </h1>
        
        <div className="w-24 h-1 bg-wedding-primary mx-auto my-6" />
        
        <p className="text-xl md:text-2xl text-white mb-8">
          {date}
        </p>
        
        <Button
          onClick={scrollToRsvp}
          className="bg-wedding-primary hover:bg-wedding-accent text-white px-8 py-6 rounded-md text-lg font-medium transition-all transform hover:scale-105"
        >
          אישור הגעה
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
