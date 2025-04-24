import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeSection, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Navigation items with icons and labels
  const navItems = [
    { id: 'hero', label: 'Home', icon: 'heroicons:home' },
    { id: 'problem', label: 'The Problem', icon: 'heroicons:exclamation-triangle' },
    { id: 'teaser', label: 'Our Solution', icon: 'heroicons:light-bulb' },
    { id: 'howItWorks', label: 'How It Works', icon: 'heroicons:cog-6-tooth' },
    { id: 'exclusiveAccess', label: 'Early Access', icon: 'heroicons:key' },
    { id: 'faq', label: 'FAQ', icon: 'heroicons:question-mark-circle' },
    { id: 'finalCta', label: 'Get Started', icon: 'heroicons:arrow-right' },
  ];
  
  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2 backdrop-blur-lg bg-deep-blue/80' : 'py-4 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-electric-blue font-bold text-xl mr-2">CRED-ABILITY</span>
            <div className="h-4 w-4 rounded-full bg-electric-blue animate-pulse"></div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                  activeSection === item.id
                    ? 'bg-electric-blue/20 text-electric-blue'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon icon={item.icon} className="mr-2" />
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue"
                    layoutId="activeSection"
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon icon={menuOpen ? "heroicons:x-mark" : "heroicons:bars-3"} className="text-2xl" />
          </button>
        </div>
      </motion.nav>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-deep-blue/95 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            
            <motion.div
              className="relative h-full flex flex-col overflow-y-auto p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMenuOpen(false);
                  }}
                  className={`py-4 flex items-center text-lg ${
                    activeSection === item.id
                      ? 'text-electric-blue'
                      : 'text-white/70'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon icon={item.icon} className="mr-3 text-2xl" />
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      className="ml-auto h-2 w-2 rounded-full bg-electric-blue"
                      layoutId="activeMobileSection"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;