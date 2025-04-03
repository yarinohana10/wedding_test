import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface HeroSectionProps {
  date: string;
  coupleName: string;
  heroImages: string[];
}

const HeroSection = ({ coupleName, date, heroImages }: HeroSectionProps) => {
  const scrollToRsvp = () => {
    const rsvpElement = document.getElementById("rsvp");
    if (rsvpElement) {
      rsvpElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Carousel
          className="w-full h-full"
          opts={{
            loop: true,
            duration: 60,
          }}
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index}  className="h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full w-full transition-opacity duration-1000"
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80)` }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 text-center p-6 max-w-3xl animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-heebo">
          {coupleName}
        </h1>

        <div className="w-24 h-1 bg-wedding-primary mx-auto my-6" />

        <p className="text-xl md:text-2xl text-white mb-8">{date}</p>

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
