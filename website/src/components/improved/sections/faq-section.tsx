import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

const FaqSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  
  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  const faqs = [
    {
      question: 'How is CRED-ABILITY different from traditional password managers?',
      answer: 'Unlike traditional password managers that simply store credentials, CRED-ABILITY provides intelligent context analysis to understand relationships between your credentials, proactively identifies security risks, and offers personalized recommendations for enhancing your digital security posture. Our zero-friction capture system also minimizes the effort required to secure your credentials.'
    },
    {
      question: 'Is my data secure with CRED-ABILITY?',
      answer: 'Absolutely. CRED-ABILITY employs defense-in-depth security with multiple layers of protection. We use AES-256-GCM encryption with a zero-knowledge architecture, meaning your credentials are encrypted locally on your device before transmission. Even we cannot access your unencrypted credentials. Additionally, we implement hierarchical key structures, secure key derivation with Argon2id, and compartmentalized security zones to ensure maximum protection of your sensitive information.'
    },
    {
      question: 'What platforms does CRED-ABILITY support?',
      answer: 'CRED-ABILITY is designed to work seamlessly across all major platforms. Our browser integration supports Chrome, Firefox, Safari, and Edge. We also offer native applications for Windows, macOS, iOS, and Android, with data synchronizing securely across all your devices.'
    },
    {
      question: 'How does the beta program work?',
      answer: 'Our beta program provides early access to CRED-ABILITY before its public release. Beta participants will receive a special access code to install the application, and we will actively collect feedback to refine the product. Beta users also receive lifetime preferential pricing and dedicated support. Due to high demand, beta access is limited and we are accepting applications on a rolling basis.'
    },
    {
      question: 'What happens if I already use another password manager?',
      answer: 'CRED-ABILITY offers seamless migration tools that can import your existing credentials from most popular password managers including LastPass, 1Password, Dashlane, Bitwarden, and KeePass. The migration process is secure and preserves your folder structure and metadata where possible, making the transition smooth and straightforward.'
    },
    {
      question: 'Is CRED-ABILITY compliant with regulations like GDPR and CCPA?',
      answer: 'Yes, CRED-ABILITY is designed with privacy regulations in mind. We are fully compliant with GDPR, CCPA, and other major privacy regulations. Our zero-knowledge architecture means we store minimal personal data about you, and you always maintain control over your information. We provide data portability, the right to be forgotten, and transparent privacy policies to ensure compliance with global privacy standards.'
    },
    {
      question: 'What kind of support is available?',
      answer: 'CRED-ABILITY offers comprehensive support options including detailed documentation, video tutorials, email support, and community forums. Beta users and paid subscribers receive priority support with faster response times. Enterprise customers also receive dedicated account management and custom implementation assistance.'
    },
    {
      question: 'Will there be a free version of CRED-ABILITY?',
      answer: 'Yes, we plan to offer a free tier with core credential management functionality after our beta period concludes. Premium features such as advanced security analytics, priority support, and enhanced security monitoring will be available through subscription plans. Beta participants will receive special pricing on all plans.'
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
          QUESTIONS & ANSWERS
        </span>
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-electric-blue mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Everything you need to know about CRED-ABILITY and our beta program.
        </p>
      </motion.div>
      
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className={`glass-card overflow-hidden transition-all duration-300 ${expandedIndex === index ? 'border-electric-blue/30' : 'border-white/5'}`}
              variants={itemVariants}
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left"
                onClick={() => handleToggle(index)}
                aria-expanded={expandedIndex === index}
              >
                <span className="text-lg font-medium pr-8">{faq.question}</span>
                <span className={`text-electric-blue transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`}>
                  <Icon icon="mdi:chevron-down" width="24" />
                </span>
              </button>
              
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="h-px bg-white/10 mb-5"></div>
                      <p className="text-white/70">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <p className="text-white/70 mb-6">
            Still have questions? We're happy to help.
          </p>
          <a 
            href="mailto:support@cred-ability.io"
            className="inline-flex items-center gap-2 premium-button"
          >
            <Icon icon="mdi:email-outline" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FaqSection;