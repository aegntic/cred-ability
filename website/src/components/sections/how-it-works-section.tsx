import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

interface HowItWorksSectionProps {
  isActive?: boolean;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ isActive = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);

  // Auto-rotate through components
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoplaying && inView) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoplaying, inView]);

  // Pause autoplay when user interacts
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsAutoplaying(false);
  };

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

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  };

  const steps = [
    {
      icon: 'heroicons:cursor-arrow-rays',
      title: 'Browser Integration Engine',
      description: 'Automatically detects credentials across web applications with credential detection patterns, confidence scoring, and context extraction.',
      features: [
        'Real-time credential detection',
        'Multi-format support (passwords, API keys, tokens)',
        'Contextual information extraction',
        'Confidence scoring algorithm',
      ],
      color: 'bg-blue-500/20 text-blue-400',
      accentColor: 'rgba(59, 130, 246, 0.5)',
      glowColor: 'rgba(59, 130, 246, 0.2)'
    },
    {
      icon: 'heroicons:server',
      title: 'Model Context Protocol Server',
      description: 'Processes credential events and coordinates between components with classification system and context graph building.',
      features: [
        'Event processing pipeline',
        'Real-time credential validation',
        'Service mapping and classification',
        'Context graph construction',
      ],
      color: 'bg-purple-500/20 text-purple-400',
      accentColor: 'rgba(168, 85, 247, 0.5)',
      glowColor: 'rgba(168, 85, 247, 0.2)'
    },
    {
      icon: 'heroicons:lock-closed',
      title: 'Credential Vault',
      description: 'Securely stores credentials using AES-256-GCM encryption, Argon2id key derivation, and key rotation capabilities.',
      features: [
        'Military-grade AES-256-GCM encryption',
        'Argon2id key derivation function',
        'Zero-knowledge architecture',
        'Automated key rotation',
      ],
      color: 'bg-amber-500/20 text-amber-400',
      accentColor: 'rgba(245, 158, 11, 0.5)',
      glowColor: 'rgba(245, 158, 11, 0.2)'
    },
    {
      icon: 'heroicons:light-bulb',
      title: 'Intelligence Layer',
      description: 'Analyzes context and generates security recommendations with risk assessment and rotation planning.',
      features: [
        'Proactive security recommendations',
        'Risk profile assessment',
        'Credential relationship mapping',
        'Automated rotation planning',
      ],
      color: 'bg-green-500/20 text-green-400',
      accentColor: 'rgba(34, 197, 94, 0.5)',
      glowColor: 'rgba(34, 197, 94, 0.2)'
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center py-20"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      id="how-it-works"
    >
      <div className="text-center mb-16">
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1 rounded-full bg-electric-blue/20 text-electric-blue font-mono text-sm mb-4 backdrop-blur-sm border border-electric-blue/30">
            TECHNOLOGY
          </span>
        </motion.div>
        
        <motion.h2 
          className="premium-heading text-3xl md:text-4xl lg:text-5xl mx-auto relative"
          variants={itemVariants}
        >
          <span className="relative z-10">How CRED-<span style={{ fontSize: '1.1em' }}>a</span>BILITY Works</span>
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent rounded-full blur-sm"></span>
        </motion.h2>
        
        <motion.p 
          className="text-xl text-white/80 max-w-3xl mx-auto mt-6"
          variants={itemVariants}
        >
          Our system architecture contains four primary components working in harmony
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Interactive architecture visualization */}
        <motion.div 
          className="relative order-2 lg:order-1 min-h-[500px] flex items-center justify-center"
          variants={itemVariants}
        >
          <div className="luxury-card w-full h-full p-0 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-lg">
            {/* Architecture diagram */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Pulsing glow effect for active component */}
              <motion.div 
                className="absolute rounded-full"
                style={{
                  width: '120px',
                  height: '120px',
                  background: `radial-gradient(circle, ${steps[activeStep].accentColor} 0%, transparent 70%)`,
                  boxShadow: `0 0 60px 30px ${steps[activeStep].glowColor}`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              {/* Central hub */}
              <div className="absolute w-28 h-28 rounded-full bg-electric-blue/10 backdrop-blur-md border border-electric-blue/30 flex items-center justify-center z-20">
                <div className="absolute w-20 h-20 rounded-full bg-electric-blue/20 backdrop-blur-md border border-electric-blue/30 flex items-center justify-center">
                  <Icon icon="heroicons:server-stack" className="text-electric-blue text-2xl" />
                </div>
                
                {/* Hub pulse animation */}
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-electric-blue/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-electric-blue/30"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.3,
                  }}
                />
              </div>
              
              {/* Connection lines with animated data flow */}
              <div className="absolute inset-0 z-10">
                {steps.map((step, index) => {
                  const angle = (Math.PI * 2 * index) / steps.length;
                  const isActive = index === activeStep;
                  
                  return (
                    <React.Fragment key={`line-${index}`}>
                      <motion.div 
                        className={`absolute top-1/2 left-1/2 h-px origin-left ${isActive ? 'bg-gradient-to-r from-electric-blue via-electric-blue/80 to-transparent' : 'bg-white/20'}`}
                        style={{ 
                          width: '150px',
                          transform: `translate(-50%, -50%) rotate(${angle * (180 / Math.PI)}deg)`,
                        }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.3,
                          height: isActive ? '2px' : '1px',
                        }}
                      />
                      
                      {isActive && (
                        <>
                          {/* Animated data packets */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-electric-blue z-30"
                            style={{
                              originX: 0,
                              originY: 0,
                              rotate: `${angle * (180 / Math.PI)}deg`,
                            }}
                            animate={{
                              x: [0, 150 * Math.cos(angle)],
                              y: [0, 150 * Math.sin(angle)],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              ease: "linear",
                              repeat: Infinity,
                              delay: 0,
                            }}
                          />
                          
                          <motion.div
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-electric-blue z-30"
                            style={{
                              originX: 0,
                              originY: 0,
                              rotate: `${angle * (180 / Math.PI)}deg`,
                            }}
                            animate={{
                              x: [0, 150 * Math.cos(angle)],
                              y: [0, 150 * Math.sin(angle)],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              ease: "linear",
                              repeat: Infinity,
                              delay: 1,
                            }}
                          />
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              
              {/* Component nodes */}
              {steps.map((step, index) => {
                const angle = (Math.PI * 2 * index) / steps.length;
                const x = Math.cos(angle) * 150;
                const y = Math.sin(angle) * 150;
                const isActive = index === activeStep;
                
                return (
                  <motion.div 
                    key={`node-${index}`}
                    className={`absolute w-16 h-16 rounded-full cursor-pointer z-30 flex items-center justify-center ${isActive ? step.color : 'bg-slate-800/80'}`}
                    style={{ 
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      border: isActive ? `1px solid ${step.color.replace('/20', '/50').replace('bg-', '')}` : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: isActive ? `0 0 20px 5px ${step.glowColor}` : 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleStepClick(index)}
                    whileHover={{ scale: 1.15 }}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                    }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Icon icon={step.icon} className={`text-2xl ${isActive ? '' : 'text-white/70'}`} />
                      
                      {/* Small active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-electric-blue"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Tooltip on hover */}
                    <motion.div
                      className="absolute top-full mt-2 bg-slate-800 rounded-md px-3 py-1 text-xs text-white whitespace-nowrap pointer-events-none"
                      initial={{ opacity: 0, y: 5 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step.title}
                    </motion.div>
                  </motion.div>
                );
              })}
              
              {/* Background decorative elements */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-mesh-pattern opacity-5"></div>
                
                {/* Circular grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="50" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
                  <circle cx="250" cy="250" r="100" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
                  <circle cx="250" cy="250" r="150" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" />
                  <circle cx="250" cy="250" r="200" fill="none" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Component details card */}
        <motion.div 
          className="order-1 lg:order-2 relative"
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${activeStep}`}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="luxury-card backdrop-blur-lg bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-white/10 shadow-xl overflow-hidden relative"
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-electric-blue/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-electric-blue/10 to-transparent"></div>
              
              <div className="relative z-10">
                {/* Component icon */}
                <div className={`w-16 h-16 rounded-full ${steps[activeStep].color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon icon={steps[activeStep].icon} className="text-2xl" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
                  {steps[activeStep].title}
                  <span className="ml-2 px-2 py-0.5 text-xs font-normal rounded-full bg-electric-blue/20 text-electric-blue">
                    {activeStep + 1}/{steps.length}
                  </span>
                </h3>
                
                <p className="text-white/80 text-lg mb-6">{steps[activeStep].description}</p>
                
                {/* Feature bullets */}
                <div className="space-y-3 mb-8">
                  {steps[activeStep].features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center mr-3 mt-0.5">
                        <Icon icon="heroicons:check" className="h-3.5 w-3.5 text-electric-blue" />
                      </div>
                      <p className="text-white/70">{feature}</p>
                    </div>
                  ))}
                </div>
                
                {/* Navigation controls */}
                <div className="flex justify-between items-center">
                  <button 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    onClick={() => handleStepClick((activeStep - 1 + steps.length) % steps.length)}
                    aria-label="Previous component"
                  >
                    <Icon icon="heroicons:arrow-left" className="text-white/70 w-5 h-5" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <button 
                        key={`dot-${index}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeStep ? 'bg-electric-blue scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                        onClick={() => handleStepClick(index)}
                        aria-label={`Go to component ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    onClick={() => handleStepClick((activeStep + 1) % steps.length)}
                    aria-label="Next component"
                  >
                    <Icon icon="heroicons:arrow-right" className="text-white/70 w-5 h-5" />
                  </button>
                </div>
                
                {/* Autoplay toggle */}
                <div className="absolute top-4 right-4">
                  <button
                    className={`p-1.5 rounded-full transition-colors ${isAutoplaying ? 'bg-electric-blue/20 text-electric-blue' : 'bg-white/10 text-white/50'}`}
                    onClick={() => setIsAutoplaying(!isAutoplaying)}
                    aria-label={isAutoplaying ? "Pause autoplay" : "Start autoplay"}
                    title={isAutoplaying ? "Pause autoplay" : "Start autoplay"}
                  >
                    <Icon icon={isAutoplaying ? "heroicons:pause" : "heroicons:play"} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* CTA button */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button className="premium-button group relative overflow-hidden">
              <span className="relative z-10">Learn Technical Details</span>
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-electric-blue/30 to-electric-blue/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HowItWorksSection;
