import React from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  onClick?: () => void;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ onClick }) => {
  return (
    <motion.div 
      className="scroll-indicator"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }} // Reduced from delay:1, duration:0.8 to delay:0.5, duration:0.4
    >
      <div className="text-xs text-electric-blue mb-2 font-mono">SCROLL</div>
      <div className="chevron"></div>
      <div className="chevron"></div>
      <div className="chevron"></div>
    </motion.div>
  );
};

export default ScrollIndicator;