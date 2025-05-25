
import { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Locations", href: "#locations" },
    { name: "Current Flyer", href: "#flyer" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-[20px] border-b border-white/10" style={{ backgroundColor: 'rgba(10, 10, 10, 0.8)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-heading font-bold text-warm-gold tracking-wider">
              MY LIQUOR
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-white hover:text-warm-gold transition-colors duration-300 font-medium tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-warm-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                style={{ letterSpacing: '0.02em' }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-warm-gold transition-colors text-sm font-medium tracking-wide"
            style={{ letterSpacing: '0.02em' }}
          >
            Menu
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-[20px]" style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}>
            <nav className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-white hover:text-warm-gold transition-colors duration-300 text-sm font-medium tracking-wide"
                  style={{ letterSpacing: '0.02em' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
