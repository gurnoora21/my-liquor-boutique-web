
'use client';

import { MapPin, Clock, Phone, ArrowRight, Car, Wheelchair, CreditCard, Recycle } from "@phosphor-icons/react";
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Locations = () => {
  const mapRef = useRef(null);
  const isMapInView = useInView(mapRef, { once: true, amount: 0.5 });

  const locations = [
    {
      name: "Buffalo Run Location",
      address: "123 Buffalo Run Drive, Buffalo Run, AB",
      hours: "Mon-Sat: 10AM-10PM, Sun: 11AM-9PM",
      phone: "(403) 555-0123",
      manager: "Dave Thompson",
      yearsServing: "8",
      direction: "left"
    },
    {
      name: "Drayton Valley Location", 
      address: "456 Main Street, Drayton Valley, AB",
      hours: "Mon-Sat: 10AM-10PM, Sun: 11AM-9PM",
      phone: "(780) 555-0456",
      manager: "Sarah Mitchell",
      yearsServing: "6",
      direction: "right"
    }
  ];

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <AnimatedSection>
      <section id="locations" className="py-40 bg-light-bg relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              Locally Owned & Operated
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-8" style={{ lineHeight: '1.32' }}>
              Visit Our <span className="text-amber-500">Locations</span>
            </h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 font-body" style={{ lineHeight: '1.8' }}>
              Two convenient Alberta locations to serve you better
            </p>
          </div>

          {/* Google Maps Section */}
          <motion.div 
            ref={mapRef}
            className="mb-16 rounded-lg overflow-hidden shadow-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isMapInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2449.123456789!2d-114.1234567!3d53.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTMlMDA3JzI0LjQlMjJOIDExNCUwMDA3JzI0LjQlMjJX!5e0!3m2!1sen!2sca!4v1234567890123"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {locations.map((location, index) => (
              <motion.div 
                key={index}
                className="bg-charcoal p-8 rounded-lg border border-amber-500/20 hover:brightness-110 transition-all duration-300 group shadow-card hover:shadow-card-hover"
                initial={{ opacity: 0, x: location.direction === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="border-l-2 border-amber-500 pl-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-heading font-bold text-white group-hover:text-amber-500 transition-colors" style={{ lineHeight: '1.32' }}>
                      {location.name}
                    </h3>
                    <div className="text-sm text-amber-500 font-medium">
                      Serving for {location.yearsServing} years
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6">
                    Store Manager: {location.manager}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-300 flex items-start font-body" style={{ lineHeight: '1.8' }}>
                      <MapPin className="w-5 h-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                      {location.address}
                    </p>
                    
                    <p className="text-gray-300 flex items-center font-body" style={{ lineHeight: '1.8' }}>
                      <Clock className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                      {location.hours}
                    </p>
                    
                    <a 
                      href={`tel:${location.phone}`}
                      className="text-gray-300 flex items-center font-body hover:text-amber-500 transition-colors group/phone" 
                      style={{ lineHeight: '1.8' }}
                    >
                      <Phone className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                      <span className="border-b border-transparent group-hover/phone:border-amber-500 transition-colors">
                        {location.phone}
                      </span>
                    </a>
                  </div>

                  {/* Practical Amenities */}
                  <div className="grid grid-cols-2 gap-3 mb-8 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-amber-500 mr-2" />
                      Free Parking
                    </div>
                    <div className="flex items-center">
                      <Wheelchair className="w-4 h-4 text-amber-500 mr-2" />
                      Accessible
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-amber-500 mr-2" />
                      ATM On Site
                    </div>
                    <div className="flex items-center">
                      <Recycle className="w-4 h-4 text-amber-500 mr-2" />
                      Bottle Return
                    </div>
                  </div>

                  <a 
                    href={getDirectionsUrl(location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-all duration-300 font-medium inline-flex items-center group/link shadow-lg hover:shadow-xl"
                  >
                    Get Directions
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default Locations;
