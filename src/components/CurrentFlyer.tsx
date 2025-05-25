
import { Button } from "@/components/ui/button";

const CurrentFlyer = () => {
  return (
    <section id="flyer" className="py-40 bg-dark-bg relative overflow-hidden">
      {/* Subtle horizontal divider */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-warm-gold/30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8" style={{ lineHeight: '1.32' }}>
            This Week's <span className="text-warm-gold">Selection</span>
          </h2>
          <div className="w-24 h-0.5 bg-warm-gold mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 font-body" style={{ lineHeight: '1.8' }}>
            Curated selections updated weekly
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-charcoal p-8 rounded-lg border border-warm-gold/30 hover:border-warm-gold/50 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center mb-8 border border-gray-600 overflow-hidden">
                <iframe
                  src="/Halloween  Flyer Drayton Valley.pdf"
                  className="w-full h-full border-0"
                  title="Halloween Flyer - Drayton Valley"
                />
              </div>
              
              <h3 className="text-2xl font-heading font-bold text-white mb-6" style={{ lineHeight: '1.32' }}>
                Halloween Specials - Drayton Valley
              </h3>
              
              <p className="text-gray-300 mb-8 font-body" style={{ lineHeight: '1.8' }}>
                Don't miss our spooktacular Halloween deals! Special pricing on select spirits, wines, and seasonal favorites. 
                Valid for a limited time at our Drayton Valley location.
              </p>

              <Button 
                size="lg"
                className="bg-warm-gold hover:bg-warm-gold/90 text-charcoal font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105"
              >
                View Collection
              </Button>
            </div>
          </div>
        </div>
        
        {/* Subtle horizontal divider */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-warm-gold/30"></div>
      </div>
    </section>
  );
};

export default CurrentFlyer;
