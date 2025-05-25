
import { Button } from "@/components/ui/button";

const CurrentFlyer = () => {
  return (
    <section id="flyer" className="py-20 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-yellow-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            This Week's <span className="text-yellow-400">Specials</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">
            Discover exceptional deals on premium spirits and wines
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-6 border border-gray-600">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg">Current Flyer Preview</p>
                  <p className="text-sm">Updated Weekly</p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Premium Selection at Unbeatable Prices
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Browse our weekly specials featuring handpicked wines, premium spirits, and craft beverages. 
                New deals every week with savings up to 30% on select items.
              </p>

              <Button 
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105"
              >
                View Full Flyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentFlyer;
