import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

interface ProductTeaserSectionProps {
  isActive?: boolean;
}

const ProductTeaserSection: React.FC<ProductTeaserSectionProps> = ({ isActive = false }) => {
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const features = [
    {
      icon: 'heroicons:magnifying-glass',
      title: 'Intelligent Detection',
      description: 'Automatically identifies credentials across digital platforms',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: 'heroicons:document-chart-bar',
      title: 'Contextual Analysis',
      description: 'Understands relationships and dependencies between credentials',
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      icon: 'heroicons:shield-check',
      title: 'Proactive Security',
      description: 'Provides recommendations before breaches occur',
      color: 'bg-green-500/20 text-green-400'
    },
    {
      icon: 'heroicons:sparkles',
      title: 'Frictionless Experience',
      description: 'Security enhancement without user burden',
      color: 'bg-amber-500/20 text-amber-400'
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
      <div className="text-center mb-16">
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1 rounded-full bg-electric-blue/20 text-electric-blue font-mono text-sm mb-4">
            OUR SOLUTION
          </span>
        </motion.div>
        
        <motion.h2 
          className="premium-heading text-3xl md:text-4xl lg:text-5xl mx-auto"
          variants={itemVariants}
        >
          Transforming Credential Management
        </motion.h2>
        
        <motion.p 
          className="text-xl text-white/80 max-w-3xl mx-auto mt-6"
          variants={itemVariants}
        >
          CRED-ABILITY creates a paradigm shift in credential management through four key innovations
        </motion.p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={itemVariants}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="luxury-card group"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
              <Icon icon={feature.icon} className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-white/70">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="mt-16 text-center"
        variants={itemVariants}
      >
        <button className="premium-button gold">
          Request Early Access
        </button>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-20 right-0 w-64 h-64 rounded-full bg-electric-blue/5 blur-3xl"
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2 
        }}
      />
    </motion.div>
  );
};

export default ProductTeaserSection;