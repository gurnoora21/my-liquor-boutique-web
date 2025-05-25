
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "@phosphor-icons/react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Locations", href: "#locations" },
    { name: "Current Flyer", href: "#flyer" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-charcoal border-t border-gray-700">
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Company Info & Quick Links */}
          <div>
            <img 
              src="/lovable-uploads/1f945011-1c2c-44f2-8b0e-5e094c7cf22b.png" 
              alt="My Liquor" 
              className="h-12 w-auto mb-8"
            />
            <p className="text-gray-400 mb-8 font-body" style={{ lineHeight: '1.8' }}>
              Alberta's premier destination for exceptional spirits, fine wines, and curated collections.
            </p>
            
            <h4 className="text-white font-heading font-semibold mb-6" style={{ lineHeight: '1.32' }}>Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-warm-gold transition-colors duration-300 font-body" style={{ lineHeight: '1.8' }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Hours */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-8" style={{ lineHeight: '1.32' }}>Store Hours</h4>
            <div className="space-y-4 text-gray-400 font-body" style={{ lineHeight: '1.8' }}>
              <div className="flex justify-between">
                <span>Monday - Saturday</span>
                <span>10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 9:00 PM</span>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-sm flex items-center mb-2">
                  <Phone className="w-4 h-4 text-warm-gold mr-2" />
                  Buffalo Run: (403) 555-0123
                </p>
                <p className="text-sm flex items-center">
                  <Phone className="w-4 h-4 text-warm-gold mr-2" />
                  Drayton Valley: (780) 555-0456
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-8" style={{ lineHeight: '1.32' }}>Stay Updated</h4>
            <p className="text-gray-400 mb-6 font-body" style={{ lineHeight: '1.8' }}>
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
            
            <div className="space-y-4">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-warm-gold"
              />
              <Button 
                className="w-full bg-warm-gold hover:bg-warm-gold/90 text-charcoal font-semibold"
              >
                Subscribe
              </Button>
            </div>

            {/* Social Media */}
            <div className="mt-12">
              <h5 className="text-white font-heading font-medium mb-6" style={{ lineHeight: '1.32' }}>Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-warm-gold transition-colors text-xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-warm-gold transition-colors text-xl">📷</a>
                <a href="#" className="text-gray-400 hover:text-warm-gold transition-colors text-xl">🐦</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0 font-body" style={{ lineHeight: '1.8' }}>
              © 2024 My Liquor. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-warm-gold transition-colors font-body" style={{ lineHeight: '1.8' }}>Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-warm-gold transition-colors font-body" style={{ lineHeight: '1.8' }}>Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-warm-gold transition-colors font-body" style={{ lineHeight: '1.8' }}>Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
