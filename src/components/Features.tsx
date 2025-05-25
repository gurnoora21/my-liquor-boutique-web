
'use client';

import { Beer, DollarSign, Users } from "lucide-react";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: <Beer className="w-8 h-8 text-white" />,
      title: "Great Selection, Fair Prices",
      description: "Wide variety of beer, wine, and spirits at prices that won't break the bank"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-white" />,
      title: "We'll Beat Any Local Price",
      description: "Found it cheaper locally? Bring us the ad and we'll match it, guaranteed"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Friendly Staff Who Know Their Stuff",
      description: "Our team is here to help you find exactly what you're looking for"
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

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-32 bg-dark-bg relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Why Choose <span className="text-warm-gold">My Liquor</span>
          </h2>
          <div className="w-16 h-px bg-warm-gold mx-auto"></div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="text-center p-6 bg-charcoal rounded-lg border border-gray-700 hover:border-warm-gold/50 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-3 rounded-full bg-gray-800 group-hover:bg-warm-gold/10 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-lg font-heading font-semibold text-white mb-4 group-hover:text-warm-gold transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm">Open Until 10 PM • Weekly Specials • Cold Storage Available</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
