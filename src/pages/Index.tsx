
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Locations from "@/components/Locations";
import CurrentFlyer from "@/components/CurrentFlyer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Check if user has already seen the loader this session
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    
    if (hasSeenLoader) {
      setShowLoader(false);
    }
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('hasSeenLoader', 'true');
    setShowLoader(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AnimatePresence mode="wait">
        {showLoader && (
          <LoadingScreen key="loader" onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>
      
      {!showLoader && (
        <>
          <Header />
          <Hero />
          <About />
          <Features />
          <Locations />
          <CurrentFlyer />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
