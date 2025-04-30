import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ProblemSectionProps {
  isActive?: boolean;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ isActive = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
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
      className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
              THE CHALLENGE
            </span>
          </motion.div>
          
          <motion.h2 
            className="premium-heading text-3xl md:text-4xl lg:text-5xl mb-8"
            variants={itemVariants}
          >
            Digital Identities Are <br/>Increasingly Vulnerable
          </motion.h2>
          
          <motion.div variants={itemVariants}>
            <p className="text-lg text-white/80 mb-6">
              The average person manages over 100 credentials across various platforms, creating significant security challenges:
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-4 h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue">
                  81%
                </div>
                <p className="text-white/70">of data breaches involve weak or stolen passwords</p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue">
                  59%
                </div>
                <p className="text-white/70">of people reuse passwords across multiple services</p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue">
                  55%
                </div>
                <p className="text-white/70">of organizations experienced a credential-based attack in the past year</p>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-8">
            <button className="premium-button">
              Learn About Our Solution
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="luxury-card h-full p-8 relative z-10">
            <h3 className="text-xl font-bold text-electric-blue mb-4">Traditional Solutions Fall Short</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="shrink-0 mr-4 h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  ✕
                </div>
                <div>
                  <h4 className="font-semibold text-white">Manual Entry Burden</h4>
                  <p className="text-white/70">Users must manually input and maintain credentials</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 mr-4 h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  ✕
                </div>
                <div>
                  <h4 className="font-semibold text-white">No Contextual Understanding</h4>
                  <p className="text-white/70">Credentials exist in isolation without relationship mapping</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 mr-4 h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  ✕
                </div>
                <div>
                  <h4 className="font-semibold text-white">Reactive Security</h4>
                  <p className="text-white/70">Only respond to breaches after they occur</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 mr-4 h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  ✕
                </div>
                <div>
                  <h4 className="font-semibold text-white">Poor User Experience</h4>
                  <p className="text-white/70">Security and convenience seen as opposing forces</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Decorative element */}
          <div className="absolute top-1/3 -right-8 w-16 h-16 rounded-full bg-gold/30 blur-xl"></div>
          <div className="absolute bottom-1/3 -left-8 w-24 h-24 rounded-full bg-electric-blue/20 blur-xl"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProblemSection;