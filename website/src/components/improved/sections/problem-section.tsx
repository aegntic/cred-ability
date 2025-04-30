import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';

interface CountUpAnimationProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({ 
  end, 
  prefix = '', 
  suffix = '', 
  duration = 2000,
  decimals = 0 
}) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smoother animation
        const easedProgress = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
        
        setCount(easedProgress * end);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, end, duration]);

  // Format the number according to decimals
  const formattedCount = count.toFixed(decimals);

  return <span ref={ref}>{prefix}{formattedCount}{suffix}</span>;
};

const ProblemSection: React.FC = () => {
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const problemItems = [
    {
      icon: 'material-symbols:lock-person-rounded',
      title: 'Credential Sprawl',
      description: 'Users manage an average of 100+ accounts across various platforms, leading to insecure practices like password reuse and weak credentials.',
      stats: '80% of breaches involve compromised credentials.'
    },
    {
      icon: 'material-symbols:visibility-off-rounded',
      title: 'Lack of Context',
      description: 'Traditional password managers lack understanding of how credentials relate to each other or the security implications of specific sites.',
      stats: '35% of users struggle to organize credentials logically.'
    },
    {
      icon: 'material-symbols:update-disabled-rounded',
      title: 'Reactive Security',
      description: 'Most security solutions only respond after a breach has occurred, rather than proactively preventing credential compromise.',
      stats: 'The average breach takes 277 days to identify and contain.'
    },
    {
      icon: 'material-symbols:phonelink-lock-rounded',
      title: 'Complex User Experience',
      description: 'High-friction credential management leads to user abandonment, forcing a choice between security and convenience.',
      stats: '52% of users reuse passwords due to management difficulty.'
    }
  ];

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-6 py-24"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
            THE CHALLENGE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-electric-blue mb-6">
            Why Credential Management Needs Reinvention
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The digital identity landscape continues to grow in complexity, yet our tools for managing credentials remain stuck in the past.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          variants={containerVariants}
        >
          {problemItems.map((item, index) => (
            <motion.div
              key={index}
              className="glass-card h-full relative overflow-hidden group"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-electric-blue/5 rounded-full blur-xl group-hover:bg-electric-blue/10 transition-all duration-700"></div>
              
              <div className="flex items-start gap-5 relative z-10">
                <div className="bg-electric-blue/10 rounded-xl p-3 text-electric-blue">
                  <Icon icon={item.icon} className="text-3xl" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 mb-4">{item.description}</p>
                  
                  <motion.div 
                    className="text-sm font-mono bg-navy-blue/30 border border-electric-blue/20 rounded-md px-3 py-2 text-electric-blue mt-auto overflow-hidden relative"
                    whileInView={{ 
                      scale: [0.95, 1.05, 1],
                      boxShadow: ['0 0 0px rgba(0, 180, 216, 0)', '0 0 15px rgba(0, 180, 216, 0.5)', '0 0 5px rgba(0, 180, 216, 0.2)'],
                      transition: { duration: 1.5, times: [0, 0.5, 1] } 
                    }}
                  >
                    <motion.div 
                      className="absolute bottom-0 left-0 h-full bg-electric-blue/20" 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <div className="relative z-10">
                      <motion.span 
                        className="opacity-70 mr-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.7 }}
                        transition={{ duration: 0.5 }}
                      >
                        STAT:
                      </motion.span> 
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                      >
                        {item.stats}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-electric-blue/70 to-transparent transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-20 text-center"
          variants={itemVariants}
        >
          <div className="glass-card bg-electric-blue/5 border-electric-blue/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-white">The Security Paradox</h3>
            <p className="text-lg text-white/80 mb-4">
              As our digital presence expands, the gap between security best practices and user behavior continues to widen.
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8 text-center">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-electric-blue mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUpAnimation end={91} suffix="%" />
                </motion.div>
                <p className="text-sm text-white/60">of users understand password reuse risks</p>
              </motion.div>
              <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-electric-blue mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUpAnimation end={66} suffix="%" />
                </motion.div>
                <p className="text-sm text-white/60">still reuse passwords anyway</p>
              </motion.div>
              <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-electric-blue mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <CountUpAnimation end={4.35} prefix="$" suffix="M" decimals={2} />
                </motion.div>
                <p className="text-sm text-white/60">average cost of a data breach</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProblemSection;