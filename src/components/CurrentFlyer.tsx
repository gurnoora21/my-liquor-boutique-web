
'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import AnimatedSection from './AnimatedSection';

const CurrentFlyer = () => {
  const [currentFlyer, setCurrentFlyer] = useState(0);
  
  const flyers = [
    {
      src: "/FLYER - Hallowen Sale 1.jpg",
      alt: "Halloween Sale Flyer - Page 1"
    },
    {
      src: "/FLYER - Hallowen Sale 2.jpg", 
      alt: "Halloween Sale Flyer - Page 2"
    }
  ];

  const nextFlyer = () => {
    setCurrentFlyer((prev) => (prev + 1) % flyers.length);
  };

  const prevFlyer = () => {
    setCurrentFlyer((prev) => (prev - 1 + flyers.length) % flyers.length);
  };

  return (
    <AnimatedSection>
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
                <div className="relative w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center mb-8 border border-gray-600 overflow-hidden">
                  <img
                    src={flyers[currentFlyer].src}
                    alt={flyers[currentFlyer].alt}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation buttons */}
                  {flyers.length > 1 && (
                    <>
                      <button
                        onClick={prevFlyer}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-warm-gold/20 hover:bg-warm-gold/40 text-white p-2 rounded-full transition-all duration-300"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextFlyer}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-warm-gold/20 hover:bg-warm-gold/40 text-white p-2 rounded-full transition-all duration-300"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Page indicators */}
                {flyers.length > 1 && (
                  <div className="flex justify-center space-x-2 mb-6">
                    {flyers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFlyer(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentFlyer === index ? 'bg-warm-gold' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
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
    </AnimatedSection>
  );
};

export default CurrentFlyer;
