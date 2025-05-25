
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-bg">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-32">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 text-white leading-tight" style={{ lineHeight: '1.32' }}>
            Exceptional Spirits.
          </h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-12 text-warm-gold leading-tight" style={{ lineHeight: '1.32' }}>
            Unmatched Experience.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto font-body" style={{ lineHeight: '1.8' }}>
            Discover Alberta's premier destination for fine wines, craft spirits, and curated collections
          </p>
          
          <Button 
            size="lg" 
            className="bg-warm-gold hover:bg-warm-gold/90 text-charcoal font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore Our Collection
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-warm-gold rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
