
const About = () => {
  return (
    <section className="py-40 bg-light-bg relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <div className="w-16 h-0.5 bg-warm-gold mx-auto mb-12"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12 text-charcoal" style={{ lineHeight: '1.32' }}>
            Redefining Your 
            <span className="text-warm-gold block">Liquor Experience</span>
          </h2>
          
          <div className="text-lg md:text-xl text-gray-600 space-y-8 font-body" style={{ lineHeight: '1.8' }}>
            <p>
              At My Liquor, we believe every bottle tells a story. Since our inception, we've been dedicated to bringing you an unparalleled selection of premium spirits, wines, and craft beverages.
            </p>
            
            <p>
              Our two Alberta locations combine extensive variety with competitive pricing, backed by our price-match guarantee. Our expert staff don't just sell liquor – they share their passion, helping you discover the perfect pour for any occasion.
            </p>
          </div>

          <div className="mt-16">
            <div className="w-24 h-0.5 bg-warm-gold mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
