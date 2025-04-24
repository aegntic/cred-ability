import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

interface FaqSectionProps {
  isActive?: boolean;
}

const FaqSection: React.FC<FaqSectionProps> = ({ isActive = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const faqs = [
    {
      question: "What makes CRED-ABILITY different from traditional password managers?",
      answer: "Unlike traditional password managers that require manual entry, CRED-ABILITY automatically detects credentials as you use them, analyzes their relationships, and provides proactive security recommendations. It understands how credentials are connected and gives actionable insights for improving your security posture."
    },
    {
      question: "How secure is the CRED-ABILITY credential vault?",
      answer: "CRED-ABILITY uses AES-256-GCM encryption with Argon2id key derivation, which represents military-grade security. We implement a zero-knowledge architecture, meaning your credentials are encrypted locally and only you have access to the decryption keys. Our defense-in-depth approach includes envelope encryption with a hierarchical key structure."
    },
    {
      question: "What types of credentials can CRED-ABILITY manage?",
      answer: "CRED-ABILITY can detect and manage a wide range of credentials including passwords, API keys, OAuth tokens, secret keys, personal access tokens, and more. Our intelligent detection engine recognizes patterns across various platforms and service types."
    },
    {
      question: "Is CRED-ABILITY available for enterprise use?",
      answer: "Yes, CRED-ABILITY offers enterprise-focused solutions with team sharing capabilities, role-based access control, compliance modules, and advanced security features. Enterprise deployments include SSO integration, audit reporting, and custom deployment options."
    },
    {
      question: "How does the intelligence layer work?",
      answer: "The intelligence layer analyzes the context and relationships between your credentials, mapping services and dependencies. It assesses risk based on multiple factors, generates prioritized security recommendations, and creates rotation plans based on credential usage patterns and vulnerabilities."
    },
    {
      question: "When will CRED-ABILITY be publicly available?",
      answer: "CRED-ABILITY is currently in private beta with a limited number of users. We're targeting a public beta release in Q2 2025, with general availability expected in Q3 2025. You can join our waitlist for early access."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="text-center mb-16">
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1 rounded-full bg-electric-blue/20 text-electric-blue font-mono text-sm mb-4">
            FAQ
          </span>
        </motion.div>
        
        <motion.h2 
          className="premium-heading text-3xl md:text-4xl lg:text-5xl mx-auto"
          variants={itemVariants}
        >
          Frequently Asked Questions
        </motion.h2>
        
        <motion.p 
          className="text-xl text-white/80 max-w-3xl mx-auto mt-6"
          variants={itemVariants}
        >
          Everything you need to know about CRED-ABILITY
        </motion.p>
      </div>
      
      <motion.div 
        className="max-w-4xl mx-auto w-full"
        variants={itemVariants}
      >
        <div className="luxury-card">
          {faqs.map((faq, index) => (
            <div key={index} className={`${index !== 0 ? 'border-t border-white/10 pt-6' : ''} ${index !== faqs.length - 1 ? 'mb-6' : ''}`}>
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-xl font-semibold text-white pr-8">{faq.question}</h3>
                <div className={`h-8 w-8 rounded-full bg-white/10 flex items-center justify-center transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  <Icon icon={openIndex === index ? "heroicons:x-mark" : "heroicons:plus"} className="text-electric-blue" />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/70 mt-4 pr-8">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <motion.div className="text-center mt-10" variants={itemVariants}>
          <p className="text-white/70 mb-4">Still have questions?</p>
          <button className="premium-button">
            Contact Us
          </button>
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 right-20 w-40 h-40 rounded-full bg-electric-blue/5 blur-3xl -z-10"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  );
};

export default FaqSection;