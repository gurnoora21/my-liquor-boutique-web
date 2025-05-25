
const About = () => {
  return (
    <section className="py-20 bg-gray-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%23FFD700" fill-opacity="0.1"/%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Redefining Your 
            <span className="text-yellow-400 block">Liquor Experience</span>
          </h2>
          
          <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
            <p>
              At My Liquor, we believe every bottle tells a story. Since our inception, we've been dedicated to bringing you an unparalleled selection of premium spirits, wines, and craft beverages.
            </p>
            
            <p>
              Our two Alberta locations combine extensive variety with competitive pricing, backed by our price-match guarantee. Our expert staff don't just sell liquor – they share their passion, helping you discover the perfect pour for any occasion.
            </p>
          </div>

          <div className="mt-12">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
