import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

interface FinalCtaSectionProps {
  onRequestAccess: () => void;
  onGetStarted: () => void;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onRequestAccess, onGetStarted }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-6 py-24"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div 
        className="glass-card max-w-4xl mx-auto overflow-hidden relative"
        variants={itemVariants}
      >
        {/* Background glow effects */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-electric-blue/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl"></div>
        
        <div className="relative z-10 p-10 md:p-16 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
            SECURE YOUR DIGITAL IDENTITY
          </span>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-electric-blue to-gold">
            Ready to Transform Your Credential Security?
          </h2>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Join the CRED-ABILITY beta program today and be among the first to experience the future of intelligent credential management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              onClick={onRequestAccess}
              className="premium-button gold text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Beta Access
            </motion.button>
            
            <motion.button
              onClick={onGetStarted}
              className="premium-button text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="flex items-center gap-2 text-white/70">
              <Icon icon="mdi:shield-check" className="text-electric-blue" />
              <span>Zero-Knowledge Security</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/70">
              <Icon icon="mdi:timer-outline" className="text-electric-blue" />
              <span>Setup in Minutes</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/70">
              <Icon icon="mdi:devices" className="text-electric-blue" />
              <span>Cross-Platform Support</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/70">
              <Icon icon="mdi:account-check" className="text-electric-blue" />
              <span>Dedicated Support</span>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/50">
              © 2025 CRED-ABILITY. All rights reserved. 
              <a href="#" className="text-electric-blue hover:underline ml-2 mr-2">Privacy Policy</a> • 
              <a href="#" className="text-electric-blue hover:underline ml-2 mr-2">Terms of Service</a> • 
              <a href="#" className="text-electric-blue hover:underline ml-2">Contact</a>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinalCtaSection;