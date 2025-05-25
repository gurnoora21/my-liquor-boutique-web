
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/lovable-uploads/5230368-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-32">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 text-white leading-tight" style={{ lineHeight: '1.58' }}>
            Curated for Connoisseurs
          </h1>
          <h2 className="text-2xl md:text-3xl font-body font-light mb-16 text-gray-300 leading-tight" style={{ lineHeight: '1.6' }}>
            Alberta's Premier Spirits Collection
          </h2>
          
          <Button 
            variant="ghost"
            size="lg" 
            className="border-2 border-warm-gold text-warm-gold hover:bg-warm-gold hover:text-charcoal font-semibold px-12 py-4 text-lg transition-all duration-500 transform hover:scale-105 bg-transparent"
          >
            Explore Our Collection
          </Button>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-24 bg-gradient-to-b from-warm-gold to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
