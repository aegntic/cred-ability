import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';
import { ExclusiveAccessFormData } from '../../types/form-types';

interface ExclusiveAccessSectionProps {
  isActive?: boolean;
  onRequestAccess?: (formData: ExclusiveAccessFormData) => void;
}

const ExclusiveAccessSection: React.FC<ExclusiveAccessSectionProps> = ({ 
  isActive = false, 
  onRequestAccess 
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  // Initialize form state with the complete data structure
  const [formData, setFormData] = useState<ExclusiveAccessFormData>({
    fullName: '',
    email: '',
    companyName: '',
    companySize: '',
    jobTitle: '',
    agreeToTerms: false
  });
  
  const [submitted, setSubmitted] = useState(false);

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
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // Generic handler to update any field in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() !== '') {
      // In a real application, we would submit this to a backend
      setSubmitted(true);
    }
  };
  
  // Handle the navigation to the full form page, passing the current form data
  const handleRequestAccess = () => {
    if (onRequestAccess) {
      onRequestAccess(formData);
    }
  };

  const metrics = [
    { label: 'Detection Accuracy', value: '95%', color: 'text-electric-blue' },
    { label: 'Current Status', value: 'Beta', color: 'text-gold' },
    { label: 'Completion', value: '40%', color: 'text-green-400' },
    { label: 'Next Phase', value: 'Q2 2025', color: 'text-purple-400' }
  ];

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
            EARLY ACCESS
          </span>
          
          <h2 className="premium-heading text-3xl md:text-4xl lg:text-5xl mb-8">
            Join The<br/>Exclusive Beta
          </h2>
          
          <p className="text-lg text-white/80 mb-10">
            CRED-<span style={{ fontSize: '1.1em' }}>a</span>BILITY is currently in private beta with limited slots available for qualified organizations and individual users. Join our waitlist to get early access to our revolutionary credential management ecosystem.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-white/60 text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              className="premium-button gold"
              onClick={handleRequestAccess}
            >
              Request Demo
            </button>
            <button 
              className="border border-white/20 hover:border-white/40 text-white px-6 py-2 rounded-lg transition-all"
              onClick={() => window.open('https://example.com/roadmap', '_blank')}
            >
              View Roadmap
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="luxury-card relative z-10">
            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Request Exclusive Access</h3>
                <p className="text-white/70 mb-8">
                  Limited spots available for our early access program. Be among the first to experience CRED-<span style={{ fontSize: '1.1em' }}>a</span>BILITY.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-white/80 mb-2 text-sm">Your Name</label>
                    <input 
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white/80 mb-2 text-sm">Email Address</label>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyName" className="block text-white/80 mb-2 text-sm">Company Name</label>
                    <input 
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companySize" className="block text-white/80 mb-2 text-sm">Organization Size</label>
                    <select 
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                      required
                    >
                      <option value="">Select organization size</option>
                      <option value="individual">Individual</option>
                      <option value="small">Small Business (1-50 employees)</option>
                      <option value="medium">Mid-Market (50-1000 employees)</option>
                      <option value="enterprise">Enterprise (1000+ employees)</option>
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="button" 
                      className="w-full premium-button"
                      onClick={handleRequestAccess}
                    >
                      Continue Application
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon icon="heroicons:check" className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
                <p className="text-white/70 mb-6">
                  Your request has been submitted. We'll be in touch shortly with details about your exclusive access.
                </p>
                <button 
                  className="text-electric-blue hover:underline"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another request
                </button>
              </div>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 -right-8 w-24 h-24 rounded-full bg-electric-blue/20 blur-xl -z-10"></div>
          <div className="absolute bottom-10 -left-12 w-32 h-32 rounded-full bg-gold/20 blur-xl -z-10"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExclusiveAccessSection;