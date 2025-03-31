
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  coupleName: string;
  date: string;
  heroImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  coupleName,
  date,
  heroImage = "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"
}) => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url(${heroImage})` }}
        />
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
          asChild
          className="bg-wedding-primary hover:bg-wedding-accent text-white px-8 py-6 rounded-md text-lg font-medium transition-all transform hover:scale-105"
        >
          <Link to="/rsvp">
            אישור הגעה
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
