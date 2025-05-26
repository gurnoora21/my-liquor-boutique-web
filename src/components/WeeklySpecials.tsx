
'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Clock, Printer } from "@phosphor-icons/react";

const WeeklySpecials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 32
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const specials = [
    {
      name: "Molson Canadian 24-Pack",
      originalPrice: "$44.99",
      salePrice: "$39.99",
      savings: "$5.00",
      image: "/placeholder.svg?height=200&width=150&text=Molson+Canadian"
    },
    {
      name: "Crown Royal 750ml",
      originalPrice: "$39.99",
      salePrice: "$32.99",
      savings: "$7.00",
      image: "/placeholder.svg?height=200&width=150&text=Crown+Royal"
    },
    {
      name: "White Claw Variety Pack",
      originalPrice: "$27.99",
      salePrice: "$23.99",
      savings: "$4.00",
      image: "/placeholder.svg?height=200&width=150&text=White+Claw"
    },
    {
      name: "Bud Light 12-Pack",
      originalPrice: "$24.99",
      salePrice: "$19.99",
      savings: "$5.00",
      image: "/placeholder.svg?height=200&width=150&text=Bud+Light"
    },
    {
      name: "Smirnoff Vodka 750ml",
      originalPrice: "$29.99",
      salePrice: "$24.99",
      savings: "$5.00",
      image: "/placeholder.svg?height=200&width=150&text=Smirnoff"
    },
    {
      name: "Miller High Life 6-Pack",
      originalPrice: "$14.99",
      salePrice: "$11.99",
      savings: "$3.00",
      image: "/placeholder.svg?height=200&width=150&text=Miller"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      rotateY: -90,
      transformOrigin: "left center"
    },
    visible: { 
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatedSection>
      <section id="specials" className="py-40 bg-dark-bg relative overflow-hidden" ref={ref}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8" style={{ lineHeight: '1.32' }}>
              This Week's <span className="text-amber-500">Deals</span>
            </h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-8"></div>
            
            {/* Countdown Timer */}
            <div className="bg-charcoal p-6 rounded-lg border border-amber-500/30 inline-block mb-8 shadow-card">
              <div className="flex items-center justify-center text-white mb-2">
                <Clock className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Deals end in:</span>
              </div>
              <div className="flex space-x-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-500">{timeLeft.days}</div>
                  <div className="text-xs text-gray-400">DAYS</div>
                </div>
                <div className="text-amber-500">:</div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-400">HOURS</div>
                </div>
                <div className="text-amber-500">:</div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-400">MINS</div>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {specials.map((special, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                className="bg-charcoal p-6 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-2 shadow-card hover:shadow-card-hover relative overflow-hidden"
              >
                {/* Savings Badge */}
                <div className="absolute top-4 right-4 bg-sale-red text-white px-2 py-1 rounded text-sm font-bold">
                  Save {special.savings}
                </div>

                <div className="text-center mb-4">
                  <div className="w-32 h-40 bg-gray-800 rounded mx-auto mb-4 flex items-center justify-center border border-gray-600">
                    <img
                      src={special.image}
                      alt={special.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <h3 className="text-lg font-heading font-semibold text-white mb-3 group-hover:text-amber-500 transition-colors">
                    {special.name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm line-through">
                      {special.originalPrice}
                    </div>
                    <div className="text-2xl font-bold text-amber-500">
                      {special.salePrice}
                    </div>
                  </div>
                </div>

                {/* Hidden "Add to List" button that appears on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button 
                    size="sm"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl"
                  >
                    Add to List
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 transition-all duration-300 group overflow-hidden relative shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center">
                  View All Specials
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Flyer
              </Button>
            </div>
            
            <p className="text-gray-400 text-sm">
              While supplies last. Prices valid at both locations.
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default WeeklySpecials;
