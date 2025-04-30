import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useHistory } from 'react-router-dom';
import ScrollIndicator from '../scroll-indicator';

interface HeroSectionProps {
  isActive?: boolean;
  onRequestAccess?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isActive = true, onRequestAccess }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  const history = useHistory();

  const handleScrollDown = () => {
    document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleExclusiveAccess = () => {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      // If no callback provided, navigate directly
      history.push('/exclusive-access');
    }
  };
  
  const handleLearnMore = () => {
    history.push('/get-started');
  };

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
    visible: { y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* Floating elements in background */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-electric-blue/10 backdrop-blur-md z-0"
        animate={{ 
          y: [0, 30, 0],
          x: [0, 15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gold/10 backdrop-blur-md z-0"
        animate={{ 
          y: [0, -40, 0],
          x: [0, -20, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ 
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      <div className="relative z-10 max-w-4xl">
        <motion.div variants={itemVariants} className="mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-electric-blue/20 text-electric-blue font-mono text-sm mb-4">
            VERSION 0.4.0
          </span>
        </motion.div>
        
        <motion.h1 
          className="premium-heading text-4xl md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Intelligent Credential <br/>Management Ecosystem
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-white/80 my-8 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          CRED-<span style={{ fontSize: '1.1em' }}>a</span>BILITY transforms how digital credentials are detected, managed, and secured with intelligent context analysis and proactive security recommendations.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          variants={itemVariants}
        >
          <button 
            className="premium-button gold"
            onClick={handleExclusiveAccess}
          >
            Request Exclusive Access
          </button>
          <button 
            className="premium-button"
            onClick={handleLearnMore}
          >
            Learn More
          </button>
        </motion.div>
        
        <motion.p 
          className="mt-8 text-sm text-white/60"
          variants={itemVariants}
        >
          Currently in private beta. <button onClick={handleExclusiveAccess} className="animated-link">Join our waitlist</button>
        </motion.p>
      </div>
      
      <ScrollIndicator onClick={handleScrollDown} />
    </motion.div>
  );
};

export default HeroSection;