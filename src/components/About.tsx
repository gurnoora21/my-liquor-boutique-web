
const About = () => {
  return (
    <section className="py-40 bg-light-bg relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12 text-charcoal" style={{ lineHeight: '1.32' }}>
            Our <span className="text-warm-gold">Philosophy</span>
          </h2>
          
          <div className="text-lg md:text-xl text-gray-600 font-body" style={{ lineHeight: '1.8' }}>
            <p>
              We believe in the artistry of exceptional spirits. Our curated collection represents decades of expertise, bringing Alberta the world's finest distilleries and vintages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
