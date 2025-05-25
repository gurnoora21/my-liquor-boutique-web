
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Locations from "@/components/Locations";
import CurrentFlyer from "@/components/CurrentFlyer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Hero />
      <About />
      <Features />
      <Locations />
      <CurrentFlyer />
      <Footer />
    </div>
  );
};

export default Index;
