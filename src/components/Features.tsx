
import { Star } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: "🍷",
      title: "Curated Selection",
      description: "Hand-picked premium spirits, wines, and craft beverages from around the world"
    },
    {
      icon: "🏷️",
      title: "Price Match Guarantee",
      description: "We match any competitor's advertised price to ensure you get the best value"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: "Expert Guidance",
      description: "Our passionate staff provides personalized recommendations for every taste"
    }
  ];

  return (
    <section className="py-20 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-yellow-400">My Liquor</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="mb-6 flex justify-center">
                {typeof feature.icon === 'string' ? (
                  <div className="text-4xl">{feature.icon}</div>
                ) : (
                  feature.icon
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
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
