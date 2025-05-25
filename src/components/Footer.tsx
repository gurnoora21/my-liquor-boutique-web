
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Locations", href: "#locations" },
    { name: "Current Flyer", href: "#flyer" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Company Info & Quick Links */}
          <div>
            <img 
              src="/lovable-uploads/06ef3501-6f2d-48f1-92cd-18390e4921ef.png" 
              alt="My Liquor" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              Alberta's premier destination for exceptional spirits, fine wines, and curated collections.
            </p>
            
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Hours */}
          <div>
            <h4 className="text-white font-semibold mb-6">Store Hours</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Saturday</span>
                <span>10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 9:00 PM</span>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-sm">
                  <span className="text-yellow-400">📞</span> Buffalo Run: (403) 555-0123
                </p>
                <p className="text-sm mt-1">
                  <span className="text-yellow-400">📞</span> Drayton Valley: (780) 555-0456
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
            
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
              />
              <Button 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
              >
                Subscribe
              </Button>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h5 className="text-white font-medium mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-xl">📷</a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-xl">🐦</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 My Liquor. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
