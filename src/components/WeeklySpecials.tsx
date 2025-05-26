'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Clock, Printer } from "@phosphor-icons/react";
import { useSalesRealtime, useSaleProductsRealtime } from '@/hooks/useSalesRealtime';
import { SaleProduct } from '@/types/sales';

const WeeklySpecials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { getActiveSale } = useSalesRealtime();
  const [activeSale, setActiveSale] = useState(null);
  const [saleId, setSaleId] = useState<string | null>(null);
  const { products } = useSaleProductsRealtime(saleId);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 32
  });

  useEffect(() => {
    const fetchActiveSale = async () => {
      const sale = await getActiveSale();
      if (sale) {
        setActiveSale(sale);
        setSaleId(sale.id);
        
        // Calculate time left until sale ends
        const endDate = new Date(sale.end_date);
        const now = new Date();
        const timeDiff = endDate.getTime() - now.getTime();
        
        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeLeft({ days, hours, minutes });
        }
      }
    };

    fetchActiveSale();
  }, [getActiveSale]);

  useEffect(() => {
    if (!activeSale) return;

    const timer = setInterval(() => {
      const endDate = new Date(activeSale.end_date);
      const now = new Date();
      const timeDiff = endDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [activeSale]);

  const calculateSavings = (original: number, sale: number) => {
    return (original - sale).toFixed(2);
  };

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

  // Show first 6 products for the preview
  const displayProducts = products.slice(0, 6);

  if (!activeSale || products.length === 0) {
    // ... keep existing code for fallback display with hardcoded specials
    const fallbackSpecials = [
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

    return (
      <AnimatedSection>
        <section id="specials" className="py-40 bg-dark-bg relative overflow-hidden" ref={ref}>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8" style={{ lineHeight: '1.32' }}>
                This Week's <span className="text-amber-500">Deals</span>
              </h2>
              <div className="w-24 h-0.5 bg-amber-500 mx-auto mb-8"></div>
              
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
              {fallbackSpecials.map((special, index) => (
                <motion.div 
                  key={index}
                  variants={cardVariants}
                  className="bg-charcoal p-6 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-2 shadow-card hover:shadow-card-hover relative overflow-hidden"
                >
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
  }

  return (
    <AnimatedSection>
      <section id="specials" className="py-40 bg-dark-bg relative overflow-hidden" ref={ref}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8" style={{ lineHeight: '1.32' }}>
              {activeSale.name} <span style={{ color: activeSale.background_color }}>Deals</span>
            </h2>
            <div className="w-24 h-0.5 mx-auto mb-8" style={{ backgroundColor: activeSale.background_color }}></div>
            
            <div className="bg-charcoal p-6 rounded-lg border border-gray-700 inline-block mb-8 shadow-card" style={{ borderColor: `${activeSale.background_color}30` }}>
              <div className="flex items-center justify-center text-white mb-2">
                <Clock className="w-5 h-5 mr-2" style={{ color: activeSale.background_color }} />
                <span className="text-sm font-medium">Deals end in:</span>
              </div>
              <div className="flex space-x-4 text-center">
                <div>
                  <div className="text-2xl font-bold" style={{ color: activeSale.background_color }}>{timeLeft.days}</div>
                  <div className="text-xs text-gray-400">DAYS</div>
                </div>
                <div style={{ color: activeSale.background_color }}>:</div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: activeSale.background_color }}>{timeLeft.hours}</div>
                  <div className="text-xs text-gray-400">HOURS</div>
                </div>
                <div style={{ color: activeSale.background_color }}>:</div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: activeSale.background_color }}>{timeLeft.minutes}</div>
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
            {displayProducts.map((product: SaleProduct, index) => (
              <motion.div 
                key={product.id}
                variants={cardVariants}
                className="bg-charcoal p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 group hover:-translate-y-2 shadow-card hover:shadow-card-hover relative overflow-hidden"
                style={{ 
                  '--hover-border-color': `${activeSale.background_color}50`
                } as React.CSSProperties}
              >
                <div className="absolute top-4 right-4 bg-sale-red text-white px-2 py-1 rounded text-sm font-bold">
                  Save ${calculateSavings(product.original_price, product.sale_price)}
                </div>

                {product.badge_text && (
                  <div 
                    className="absolute top-4 left-4 text-white px-2 py-1 rounded text-xs font-bold"
                    style={{ backgroundColor: activeSale.background_color }}
                  >
                    {product.badge_text}
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="w-32 h-40 bg-gray-800 rounded mx-auto mb-4 flex items-center justify-center border border-gray-600">
                    {product.product_image ? (
                      <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-heading font-semibold text-white mb-3 group-hover:transition-colors duration-300">
                    {product.product_name}
                  </h3>
                  
                  {product.size && (
                    <p className="text-sm text-gray-400 mb-2">{product.size}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm line-through">
                      ${product.original_price.toFixed(2)}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: activeSale.background_color }}>
                      ${product.sale_price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button 
                    size="sm"
                    className="w-full text-white font-semibold shadow-lg hover:shadow-xl"
                    style={{ 
                      backgroundColor: activeSale.background_color,
                      '--hover-bg-color': `${activeSale.background_color}dd`
                    } as React.CSSProperties}
                  >
                    Add to List
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="text-white font-semibold px-8 py-3 transition-all duration-300 group overflow-hidden relative shadow-lg hover:shadow-xl"
                style={{ backgroundColor: activeSale.background_color }}
              >
                <span className="relative z-10 flex items-center">
                  View All Specials
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:text-white"
                style={{ 
                  borderColor: activeSale.background_color,
                  color: activeSale.background_color,
                  '--hover-bg-color': activeSale.background_color
                } as React.CSSProperties}
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
