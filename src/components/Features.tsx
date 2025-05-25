
import { Wine, Phone, Star } from "@phosphor-icons/react";

const Features = () => {
  const features = [
    {
      icon: <Wine className="w-8 h-8 text-warm-gold" />,
      title: "Curated Selection",
      description: "Hand-picked premium spirits, wines, and craft beverages from around the world"
    },
    {
      icon: <Star className="w-8 h-8 text-warm-gold" />,
      title: "Price Match Guarantee",
      description: "We match any competitor's advertised price to ensure you get the best value"
    },
    {
      icon: <Star className="w-8 h-8 text-warm-gold" />,
      title: "Expert Guidance",
      description: "Our passionate staff provides personalized recommendations for every taste"
    }
  ];

  return (
    <section className="py-40 bg-dark-bg relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8" style={{ lineHeight: '1.32' }}>
            Why Choose <span className="text-warm-gold">My Liquor</span>
          </h2>
          <div className="w-24 h-0.5 bg-warm-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 bg-charcoal rounded-lg border border-warm-gold/20 hover:border-warm-gold/50 transition-all duration-300 group"
            >
              <div className="mb-6 flex justify-center">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-heading font-bold text-white mb-6 group-hover:text-warm-gold transition-colors tracking-wide" style={{ lineHeight: '1.32', letterSpacing: '0.02em' }}>
                {feature.title}
              </h3>
              
              <p className="text-gray-300 font-body opacity-80" style={{ lineHeight: '1.8' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
