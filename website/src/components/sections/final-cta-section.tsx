import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

interface FinalCtaSectionProps {
  isActive?: boolean;
  onRequestAccess?: () => void;
  onGetStarted?: () => void;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ 
  isActive = false,
  onRequestAccess,
  onGetStarted
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const benefits = [
    {
      icon: 'heroicons:lock-closed',
      title: 'Enhanced Security',
      description: 'Protect your digital identity with military-grade encryption'
    },
    {
      icon: 'heroicons:light-bulb',
      title: 'Intelligent Insights',
      description: 'Get proactive recommendations based on credential analysis'
    },
    {
      icon: 'heroicons:clock',
      title: 'Time Savings',
      description: 'Automatic detection eliminates manual credential entry'
    },
    {
      icon: 'heroicons:chart-bar',
      title: 'Proven ROI',
      description: 'Up to 1,300% return on investment for enterprise users'
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="luxury-card max-w-5xl mx-auto relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-electric-blue/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <motion.span 
              className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4"
              variants={itemVariants}
            >
              GET STARTED
            </motion.span>
            
            <motion.h2 
              className="premium-heading text-3xl md:text-4xl lg:text-5xl mx-auto"
              variants={itemVariants}
            >
              Transform Your<br/>Credential Security Today
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/80 max-w-3xl mx-auto mt-6"
              variants={itemVariants}
            >
              Join the revolution in credential management and take control of your digital identity
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            variants={itemVariants}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center mx-auto mb-4">
                  <Icon icon={benefit.icon} className="text-electric-blue text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/70 text-sm">{benefit.description}</p>
              </div>
            ))}
          </motion.div>
          
          <motion.div className="text-center" variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button 
                className="premium-button gold px-8 py-4 text-lg"
                onClick={onRequestAccess}
              >
                Request Early Access
              </button>
              <button 
                className="premium-button px-8 py-4 text-lg"
                onClick={onGetStarted}
              >
                Get Started
              </button>
            </div>
            
            <p className="text-white/60 text-sm">
              Currently in private beta. Limited spots available.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.div 
        className="mt-16 text-center text-white/50 text-sm"
        variants={itemVariants}
      >
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-electric-blue font-bold text-xl mr-2">CRED-ABILITY</span>
            <div className="h-3 w-3 rounded-full bg-electric-blue"></div>
          </div>
          <p>Intelligent Credential Management Ecosystem</p>
        </div>
        
        <div className="flex justify-center space-x-8 mb-8">
          <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          <a href="/about" className="hover:text-white transition-colors">About</a>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <a href="https://example.com/contact" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon icon="heroicons:chat-bubble-bottom-center-text" className="text-sm" />
          </a>
          <a href="mailto:info@example.com" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon icon="heroicons:envelope" className="text-sm" />
          </a>
          <a href="https://github.com/example" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon icon="heroicons:code-bracket-square" className="text-sm" />
          </a>
        </div>
        
        <p>&copy; 2025 CRED-ABILITY. All rights reserved.</p>
      </motion.div>
    </motion.div>
  );
};

export default FinalCtaSection;