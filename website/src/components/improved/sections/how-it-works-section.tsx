import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

const HowItWorksSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-cycle through slides every 4 seconds
  useEffect(() => {
    if (inView) {
      autoplayInterval.current = setInterval(() => {
        setActiveStep((prevStep) => (prevStep + 1) % workflowSteps.length);
      }, 4000);
    } else {
      if (autoplayInterval.current) {
        clearInterval(autoplayInterval.current);
      }
    }
    
    return () => {
      if (autoplayInterval.current) {
        clearInterval(autoplayInterval.current);
      }
    };
  }, [inView, workflowSteps.length]);
  
  // Reset interval when user manually changes step
  const handleStepChange = (index: number) => {
    setActiveStep(index);
    
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
      autoplayInterval.current = setInterval(() => {
        setActiveStep((prevStep) => (prevStep + 1) % workflowSteps.length);
      }, 4000);
    }
  };
  
  const workflowSteps = [
    {
      id: 'capture',
      title: 'Seamless Credential Capture',
      icon: 'mdi:form-textbox-password',
      description: 'The Browser Integration Engine intelligently detects login forms and securely captures credentials with minimal user interaction.',
      details: [
        'Automatic form detection across websites',
        'Secure capture of credentials with user consent',
        'Contextual analysis of website security posture',
        'One-click save with proper categorization'
      ],
      color: 'electric-blue'
    },
    {
      id: 'process',
      title: 'Context Analysis & Processing',
      icon: 'mdi:brain-circuit',
      description: 'The Model Context Protocol (MCP) Server processes credential events and understands relationships between different accounts and services.',
      details: [
        'AI-powered analysis of credential relationships',
        'Real-time vulnerability assessment',
        'Identification of shared credentials across sites',
        'Secure coordination between system components'
      ],
      color: 'gold'
    },
    {
      id: 'store',
      title: 'Secure Credential Storage',
      icon: 'mdi:shield-lock',
      description: 'The Credential Vault employs defense-in-depth encryption using AES-256-GCM and hierarchical key structure for maximum security.',
      details: [
        'Zero-knowledge architecture ensures privacy',
        'Defense-in-depth with multiple encryption layers',
        'Biometric and hardware security key support',
        'Cross-device synchronization with end-to-end encryption'
      ],
      color: 'electric-blue'
    },
    {
      id: 'analyze',
      title: 'Intelligence & Recommendations',
      icon: 'mdi:lightbulb-on',
      description: 'The Intelligence Layer provides actionable security recommendations based on your credential ecosystem and evolving security landscape.',
      details: [
        'Personalized security recommendations',
        'Proactive breach prevention strategies',
        'Auto-categorization of credentials by risk level',
        'Guided remediation for vulnerable accounts'
      ],
      color: 'gold'
    }
  ];
  
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
      <motion.div variants={itemVariants} className="text-center mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
          THE PROCESS
        </span>
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-electric-blue mb-6">
          How CRED-ABILITY Works
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Our intelligent ecosystem works seamlessly to provide security without sacrificing convenience.
        </p>
      </motion.div>
      
      <div className="max-w-5xl mx-auto">
        {/* Step indicators */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
        >
          {workflowSteps.map((step, index) => (
            <motion.button
              key={step.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeStep === index ? 
                `bg-${step.color === 'electric-blue' ? 'electric-blue' : 'gold'} text-white` : 
                'bg-slate-gray/20 text-white/70 hover:bg-slate-gray/30'}`}
              onClick={() => handleStepChange(index)}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">
                <Icon icon={step.icon} />
              </span>
              <span className="font-medium hidden sm:inline">{step.title}</span>
              <span className="font-medium inline sm:hidden">{`Step ${index + 1}`}</span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Step content */}
        <motion.div 
          className="relative glass-card min-h-[400px] overflow-hidden"
          variants={itemVariants}
        >
          {/* Animated background effects based on active step */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20 transition-colors duration-500 bg-${workflowSteps[activeStep].color === 'electric-blue' ? 'electric-blue' : 'gold'}`}
            ></div>
            <div 
              className={`absolute -bottom-40 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 transition-colors duration-500 bg-${workflowSteps[activeStep].color === 'electric-blue' ? 'gold' : 'electric-blue'}`}
            ></div>
          </div>
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <div 
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${workflowSteps[activeStep].color === 'electric-blue' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-gold/20 text-gold'} mb-6`}
                    >
                      <Icon icon={workflowSteps[activeStep].icon} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">
                      {workflowSteps[activeStep].title}
                    </h3>
                    
                    <p className="text-white/80 text-lg mb-6">
                      {workflowSteps[activeStep].description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-6">
                      {workflowSteps.map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => handleStepChange(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === index ? 
                            `bg-${workflowSteps[activeStep].color === 'electric-blue' ? 'electric-blue' : 'gold'} w-4` : 
                            'bg-white/30'}`}
                          aria-label={`Go to step ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className={`rounded-xl border ${workflowSteps[activeStep].color === 'electric-blue' ? 'border-electric-blue/20' : 'border-gold/20'} p-6`}>
                      <h4 className="text-lg font-medium mb-4">Key Features</h4>
                      <ul className="space-y-3">
                        {workflowSteps[activeStep].details.map((detail, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span 
                              className={`text-${workflowSteps[activeStep].color === 'electric-blue' ? 'electric-blue' : 'gold'} mt-1`}
                            >
                              <Icon icon="mdi:check-circle" />
                            </span>
                            <span className="text-white/80">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation arrows */}
          <div className="absolute left-0 right-0 bottom-6 flex justify-center gap-4 z-20">
            <motion.button
              className="w-10 h-10 rounded-full bg-slate-gray/30 flex items-center justify-center text-white/80 hover:bg-slate-gray/50 transition-colors"
              onClick={() => handleStepChange((activeStep - 1 + workflowSteps.length) % workflowSteps.length)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous step"
            >
              <Icon icon="mdi:chevron-left" />
            </motion.button>
            
            <motion.button
              className="w-10 h-10 rounded-full bg-slate-gray/30 flex items-center justify-center text-white/80 hover:bg-slate-gray/50 transition-colors"
              onClick={() => handleStepChange((activeStep + 1) % workflowSteps.length)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next step"
            >
              <Icon icon="mdi:chevron-right" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HowItWorksSection;