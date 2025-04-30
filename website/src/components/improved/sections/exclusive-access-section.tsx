import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';
import { ExclusiveAccessFormData } from '../../../types/form-types';

interface ExclusiveAccessSectionProps {
  onRequestAccess: (formData: ExclusiveAccessFormData) => void;
}

const ExclusiveAccessSection: React.FC<ExclusiveAccessSectionProps> = ({ onRequestAccess }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const [formData, setFormData] = useState<ExclusiveAccessFormData>({
    fullName: '',
    email: '',
    companyName: '',
    companySize: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ExclusiveAccessFormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof ExclusiveAccessFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error when user checks
    if (errors[name as keyof ExclusiveAccessFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExclusiveAccessFormData, string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRequestAccess(formData);
    }
  };
  
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
  
  const companySizeOptions = [
    { value: '', label: 'Select company size' },
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];
  
  const benefits = [
    {
      icon: 'mdi:rocket-launch-outline',
      title: 'Early Access',
      description: 'Be among the first to experience CRED-ABILITY before public release.'
    },
    {
      icon: 'mdi:account-voice-outline',
      title: 'Shape the Product',
      description: 'Provide feedback that directly influences product development.'
    },
    {
      icon: 'mdi:currency-usd',
      title: 'Preferential Pricing',
      description: 'Secure lifetime discount on all subscription plans.'
    },
    {
      icon: 'mdi:shield-star-outline',
      title: 'Premium Support',
      description: 'Receive dedicated support and personalized onboarding.'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
              LIMITED AVAILABILITY
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gold"
            variants={itemVariants}
          >
            Request Exclusive Access
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/80 mb-8"
            variants={itemVariants}
          >
            Join our private beta program and experience the future of credential management before anyone else.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
            variants={containerVariants}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div className="text-2xl text-gold mt-1">
                  <Icon icon={benefit.icon} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="glass-card bg-navy-blue/40 border-electric-blue/20">
            <h3 className="text-2xl font-semibold mb-6">Apply for Beta Access</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-gray/20 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-transparent transition-colors`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-gray/20 border ${errors.email ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-transparent transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-white/80 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-gray/20 border ${errors.companyName ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-transparent transition-colors`}
                    placeholder="Acme Inc."
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-white/80 mb-1">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-gray/20 border ${errors.companySize ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-transparent transition-colors appearance-none cursor-pointer`}
                  >
                    {companySizeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.companySize && (
                    <p className="mt-1 text-sm text-red-500">{errors.companySize}</p>
                  )}
                </div>
                
                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 rounded bg-slate-gray/20 border-white/10 text-electric-blue focus:ring-electric-blue/50"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="text-white/70 cursor-pointer">
                      I agree to the <a href="#" className="text-electric-blue hover:underline">Terms of Service</a> and <a href="#" className="text-electric-blue hover:underline">Privacy Policy</a>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full premium-button gold mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Application
                </motion.button>
                
                <p className="text-sm text-white/50 text-center mt-4">
                  Due to high demand, access is limited. We'll notify you if you're selected for the beta program.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExclusiveAccessSection;