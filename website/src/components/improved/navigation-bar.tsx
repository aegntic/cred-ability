import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';

import logo from '../../assets/logo.svg';

interface NavigationBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeSection, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'problem', label: 'The Problem' },
    { id: 'teaser', label: 'Our Solution' },
    { id: 'howItWorks', label: 'How It Works' },
    { id: 'exclusiveAccess', label: 'Get Access' },
    { id: 'faq', label: 'FAQ' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    onNavigate(sectionId);
    setMenuOpen(false);
  };

  const navigateToHome = () => {
    onNavigate('hero');
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 backdrop-blur-lg bg-navy-blue/80' : 'py-5 bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center" 
            onClick={navigateToHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: 'pointer' }}
          >
            <img src={logo} alt="CRED-ABILITY" className="h-12" />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <motion.li key={item.id}>
                  <button
                    className={`px-4 py-2 rounded-lg transition-all relative ${activeSection === item.id ? 'text-white' : 'text-white/70 hover:text-white'}`}
                    onClick={() => handleNavigate(item.id)}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-electric-blue to-transparent"
                        layoutId="navIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.button
              onClick={() => handleNavigate('exclusiveAccess')}
              className="ml-6 premium-button gold text-sm py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Access
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <Icon 
                icon={menuOpen ? "mdi:close" : "mdi:menu"} 
                className="text-white text-2xl" 
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden pt-20 bg-navy-blue/95 backdrop-blur-lg"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="px-6 py-4">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * navItems.indexOf(item) }}
                  >
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg ${activeSection === item.id ? 'bg-electric-blue/20 text-white' : 'text-white/80'}`}
                      onClick={() => handleNavigate(item.id)}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6">
                <motion.button
                  onClick={() => handleNavigate('exclusiveAccess')}
                  className="w-full premium-button gold text-center py-3"
                  whileTap={{ scale: 0.95 }}
                >
                  Request Access
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;