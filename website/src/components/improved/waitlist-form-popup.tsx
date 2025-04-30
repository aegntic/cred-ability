import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface WaitlistFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistFormPopup: React.FC<WaitlistFormPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    organization: '',
    reason: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [savedEntries, setSavedEntries] = useState<any[]>([]);
  
  // Load previously saved entries
  useEffect(() => {
    const savedData = localStorage.getItem('waitlistEntries');
    if (savedData) {
      try {
        setSavedEntries(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved waitlist data', error);
      }
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      // Save to localStorage
      const newEntry = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString()
      };
      
      const updatedEntries = [...savedEntries, newEntry];
      localStorage.setItem('waitlistEntries', JSON.stringify(updatedEntries));
      setSavedEntries(updatedEntries);
      
      setFormStatus('success');
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({
          email: '',
          name: '',
          organization: '',
          reason: ''
        });
        onClose();
        setFormStatus('idle');
      }, 2000);
    }, 1500);
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-blue/80 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div 
            className="w-full max-w-md"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card border border-electric-blue/20 shadow-xl shadow-electric-blue/5 overflow-hidden">
              {/* Modal header */}
              <div className="bg-navy-blue/50 p-5 border-b border-electric-blue/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">Join Our Waitlist</h3>
                  <p className="text-white/60 text-sm">Get early access to CRED-ABILITY</p>
                </div>
                <button 
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Icon icon="mdi:close" width="24" />
                </button>
              </div>
              
              {/* Modal body */}
              <div className="p-5">
                {formStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue/20 text-electric-blue mb-4">
                      <Icon icon="mdi:check-circle" width="32" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Thank You!</h4>
                    <p className="text-white/70">
                      Your waitlist registration has been received. We'll notify you when we're ready to grant you access.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email Address*</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-md bg-navy-blue/50 border border-electric-blue/20 text-white placeholder-white/40 focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue/50 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Full Name*</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-md bg-navy-blue/50 border border-electric-blue/20 text-white placeholder-white/40 focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue/50 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-white/80 mb-1">Organization</label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-md bg-navy-blue/50 border border-electric-blue/20 text-white placeholder-white/40 focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue/50 transition-colors"
                          placeholder="Your Company (Optional)"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-white/80 mb-1">Primary Interest</label>
                        <select
                          id="reason"
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-md bg-navy-blue/50 border border-electric-blue/20 text-white placeholder-white/40 focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue/50 transition-colors"
                        >
                          <option value="">Select your interest (Optional)</option>
                          <option value="personal">Personal Use</option>
                          <option value="business">Business Use</option>
                          <option value="enterprise">Enterprise Solutions</option>
                          <option value="developer">Developer Integration</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={formStatus === 'submitting'}
                          className="w-full premium-button gold py-2.5"
                        >
                          {formStatus === 'submitting' ? (
                            <span className="flex items-center justify-center">
                              <Icon icon="mdi:loading" className="animate-spin mr-2" />
                              Processing...
                            </span>
                          ) : 'Join Waitlist'}
                        </button>
                      </div>
                      
                      <p className="text-xs text-white/50 text-center mt-4">
                        By joining our waitlist, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistFormPopup;