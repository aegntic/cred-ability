import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-navy-blue/80 border-t border-electric-blue/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/src/assets/logo.svg" alt="CRED-ABILITY" className="h-10 mr-3" />
              <span className="text-xl font-bold text-white">CRED-ABILITY</span>
            </div>
            <p className="text-white/60 mb-6">
              Transforming credential management with intelligent contextual analysis and enhanced security.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-electric-blue transition-colors">
                <Icon icon="mdi:twitter" width="24" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-electric-blue transition-colors">
                <Icon icon="mdi:linkedin" width="24" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-electric-blue transition-colors">
                <Icon icon="mdi:github" width="24" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('problem')} 
                  className="text-white/60 hover:text-electric-blue transition-colors"
                >
                  The Problem
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('teaser')} 
                  className="text-white/60 hover:text-electric-blue transition-colors"
                >
                  Our Solution
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('howItWorks')} 
                  className="text-white/60 hover:text-electric-blue transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('faq')} 
                  className="text-white/60 hover:text-electric-blue transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">
                  Support Center
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Icon icon="mdi:email-outline" className="text-electric-blue mt-1 mr-2" width="18" />
                <a href="mailto:contact@cred-ability.io" className="text-white/60 hover:text-electric-blue transition-colors">
                  contact@cred-ability.io
                </a>
              </li>
              <li className="flex items-start">
                <Icon icon="mdi:map-marker-outline" className="text-electric-blue mt-1 mr-2" width="18" />
                <span className="text-white/60">
                  San Francisco, CA
                </span>
              </li>
            </ul>
            
            <button 
              onClick={() => onNavigate('exclusiveAccess')} 
              className="premium-button gold text-sm mt-6 py-2">
              Get Early Access
            </button>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {currentYear} CRED-ABILITY. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">Terms of Service</a>
            <a href="#" className="text-white/60 hover:text-electric-blue transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-electric-blue flex items-center justify-center shadow-lg shadow-electric-blue/20 z-20"
        onClick={handleScrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon icon="mdi:chevron-up" width="24" className="text-white" />
      </motion.button>
    </footer>
  );
};

export default Footer;