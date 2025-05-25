
import { Button } from "@/components/ui/button";

const Locations = () => {
  const locations = [
    {
      name: "Buffalo Run Location",
      address: "123 Buffalo Run Drive, Buffalo Run, AB",
      hours: "Mon-Sat: 10AM-10PM, Sun: 11AM-9PM",
      phone: "(403) 555-0123"
    },
    {
      name: "Drayton Valley Location", 
      address: "456 Main Street, Drayton Valley, AB",
      hours: "Mon-Sat: 10AM-10PM, Sun: 11AM-9PM",
      phone: "(780) 555-0456"
    }
  ];

  return (
    <section id="locations" className="py-20 bg-gray-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Visit Our <span className="text-yellow-400">Locations</span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">
            Two convenient Alberta locations to serve you better
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {locations.map((location, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-102 group"
            >
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                  {location.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300 flex items-start">
                    <span className="text-yellow-400 mr-2">📍</span>
                    {location.address}
                  </p>
                  
                  <p className="text-gray-300 flex items-center">
                    <span className="text-yellow-400 mr-2">🕒</span>
                    {location.hours}
                  </p>
                  
                  <p className="text-gray-300 flex items-center">
                    <span className="text-yellow-400 mr-2">📞</span>
                    {location.phone}
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
