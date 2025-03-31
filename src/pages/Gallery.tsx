import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Images, Heart } from 'lucide-react';

const Gallery = () => {
  // Sample gallery images - in a real app these would come from a database
  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1511285560929-80b456503681?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "חתונה 1" },
    { id: 2, src: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חתונה 2" },
    { id: 3, src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חתונה 3" },
    { id: 4, src: "https://images.unsplash.com/photo-1470290378674-419847e9cf3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80", alt: "חתונה 4" },
    { id: 5, src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חתונה 5" },
    { id: 6, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80", alt: "חתונה 6" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-4">
                <Images className="text-wedding-primary mr-2" size={28} />
                <h1 className="text-3xl md:text-4xl font-bold">הגלריה שלנו</h1>
              </div>
              <p className="text-gray-600">רגעים מיוחדים שאנחנו רוצים לשתף איתכם</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-w-3 aspect-h-2">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Heart className="text-white h-10 w-10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
