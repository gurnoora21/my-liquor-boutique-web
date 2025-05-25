
'use client';

import { MapPin, Clock, Phone, ArrowRight } from "@phosphor-icons/react";
import AnimatedSection from './AnimatedSection';

const Locations = () => {
  const locations = [
    {
      name: "Buffalo Run Location",
      address: "123 Buffalo Run Drive, Buffalo Run, AB",
      hours: "Mon-Sat: 10AM-10PM, Sun: 11AM-9PM",
      phone: "(403) 555-0123"
    },
    {
      name: "Drayton Valley Location", 
      address: "456 Main Street, Drayton Valley, AB",
      hours: "Mon-Sat: 10AM-10PM, Sun: 11AM-9PM",
      phone: "(780) 555-0456"
    }
  ];

  return (
    <AnimatedSection>
      <section id="locations" className="py-40 bg-light-bg relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-8" style={{ lineHeight: '1.32' }}>
              Visit Our <span className="text-warm-gold">Locations</span>
            </h2>
            <div className="w-24 h-0.5 bg-warm-gold mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 font-body" style={{ lineHeight: '1.8' }}>
              Two convenient Alberta locations to serve you better
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {locations.map((location, index) => (
              <div 
                key={index}
                className="bg-charcoal p-8 rounded-lg border border-warm-gold/20 hover:brightness-110 transition-all duration-300 group shadow-lg"
              >
                <div className="border-l-2 border-warm-gold pl-6">
                  <h3 className="text-2xl font-heading font-bold text-white mb-6 group-hover:text-warm-gold transition-colors" style={{ lineHeight: '1.32' }}>
                    {location.name}
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-300 flex items-start font-body" style={{ lineHeight: '1.8' }}>
                      <MapPin className="w-5 h-5 text-warm-gold mr-3 mt-1 flex-shrink-0" />
                      {location.address}
                    </p>
                    
                    <p className="text-gray-300 flex items-center font-body" style={{ lineHeight: '1.8' }}>
                      <Clock className="w-5 h-5 text-warm-gold mr-3 flex-shrink-0" />
                      {location.hours}
                    </p>
                    
                    <p className="text-gray-300 flex items-center font-body" style={{ lineHeight: '1.8' }}>
                      <Phone className="w-5 h-5 text-warm-gold mr-3 flex-shrink-0" />
                      {location.phone}
                    </p>
                  </div>

                  <a 
                    href="#" 
                    className="text-warm-gold hover:text-white transition-colors duration-300 font-medium inline-flex items-center group/link"
                  >
                    Get Directions
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default Locations;
