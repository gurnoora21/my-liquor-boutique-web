
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const Hero = () => {
  const [currentTagline, setCurrentTagline] = useState(0);

  const taglines = [
    "Cold Beer • Fair Prices • Friendly Service",
    "Open Late • Price Match Guarantee", 
    "Your Neighborhood Liquor Store"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Grain Overlay */}
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        {/* Subtle film grain texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white leading-tight">
            Your Local Liquor Store
          </h1>
          <h2 className="text-xl md:text-2xl font-body mb-8 text-gray-300 leading-relaxed">
            Serving Buffalo Run & Drayton Valley Since 2015
          </h2>
          
          {/* Rotating Taglines */}
          <div className="h-8 mb-12">
            <motion.p
              key={currentTagline}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-warm-gold font-medium"
            >
              {taglines[currentTagline]}
            </motion.p>
          </div>
          
          <Button 
            size="lg" 
            className="bg-warm-gold text-charcoal hover:bg-warm-gold/90 font-semibold px-8 py-4 text-lg transition-all duration-300 mb-8 group overflow-hidden relative"
          >
            <span className="relative z-10">Shop Our Specials</span>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
          </Button>

          {/* Store Hours */}
          <div className="text-gray-300 space-y-2">
            <p className="text-lg font-medium">Store Hours</p>
            <p>Monday - Saturday: 10 AM - 10 PM</p>
            <p>Sunday: 11 AM - 8 PM</p>
            <p className="text-sm text-gray-400 mt-4">19+ Valid ID Required</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
