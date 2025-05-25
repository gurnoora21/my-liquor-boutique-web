
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    // Show dots after text animation
    const dotsTimer = setTimeout(() => setShowDots(true), 800);
    
    // Complete loading after 1.5 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(dotsTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-charcoal flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* MY LIQUOR Text */}
      <motion.div
        className="text-4xl md:text-5xl font-heading font-bold text-warm-gold mb-8"
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, letterSpacing: "0.1em" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        MY LIQUOR
      </motion.div>

      {/* Pulsing Dots */}
      {showDots && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-warm-gold rounded-full"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LoadingScreen;
