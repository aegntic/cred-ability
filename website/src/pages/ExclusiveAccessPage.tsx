import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ParticleBackground from '../components/particle-background';

const ExclusiveAccessPage: React.FC = () => {
  const history = useHistory();
  const [formStep, setFormStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Input handling logic would go here
  };

  const goToNextStep = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real application, we would submit this to an API endpoint
    console.log('Form submitted');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  // Animation variants for form elements
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

  return (
    <div className="min-h-screen bg-deep-blue">
      <ParticleBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-deep-blue/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-electric-blue font-bold text-xl mr-2">CRED-ABILITY</span>
            <div className="h-4 w-4 rounded-full bg-electric-blue animate-pulse"></div>
          </Link>
          
          <button 
            onClick={() => history.push('/')}
            className="flex items-center text-white/70 hover:text-white"
          >
            <Icon icon="heroicons:arrow-left" className="mr-2" />
            Back to Home
          </button>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="max-w-4xl mx-auto"
        >
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="premium-heading text-3xl md:text-4xl">Exclusive Access Application</h1>
                <p className="text-white/80 max-w-3xl mx-auto">
                  Complete this form to request early access to CRED-ABILITY. Our team will review your application and get back to you within 48 hours.
                </p>
                
                {/* Progress indicator */}
                <div className="mt-10 flex items-center justify-center">
                  <div className="flex items-center w-full max-w-sm">
                    {[1, 2, 3].map((step) => (
                      <React.Fragment key={step}>
                        <div 
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            step < formStep ? 'bg-electric-blue border-electric-blue' : 
                            step === formStep ? 'border-electric-blue bg-transparent' : 
                            'border-white/30 bg-transparent'
                          }`}
                        >
                          {step < formStep ? (
                            <Icon icon="heroicons:check" className="text-white" />
                          ) : (
                            <span className="text-white">{step}</span>
                          )}
                        </div>
                        {step < 3 && (
                          <div className={`flex-1 h-0.5 ${step < formStep ? 'bg-electric-blue' : 'bg-white/30'}`}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="luxury-card">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Information */}
                  {formStep === 1 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-2xl font-bold text-white mb-6"
                      >
                        Basic Information
                      </motion.h2>
                      
                      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="fullName" className="block text-white/80 mb-2 text-sm">
                            Full Name*
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-white/80 mb-2 text-sm">
                            Email Address*
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="companyName" className="block text-white/80 mb-2 text-sm">
                            Company / Organization
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                            placeholder="Enter company name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="jobTitle" className="block text-white/80 mb-2 text-sm">
                            Job Title
                          </label>
                          <input
                            type="text"
                            id="jobTitle"
                            name="jobTitle"
                            className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                            placeholder="Enter your job title"
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="companySize" className="block text-white/80 mb-2 text-sm">
                          Organization Size*
                        </label>
                        <select
                          id="companySize"
                          name="companySize"
                          className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                          required
                        >
                          <option value="">Select organization size</option>
                          <option value="individual">Individual</option>
                          <option value="small">Small (1-50 employees)</option>
                          <option value="medium">Medium (51-500 employees)</option>
                          <option value="large">Large (501-5000 employees)</option>
                          <option value="enterprise">Enterprise (5000+ employees)</option>
                        </select>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={goToNextStep}
                          className="premium-button flex items-center"
                        >
                          Next Step
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Use Case Information */}
                  {formStep === 2 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-2xl font-bold text-white mb-6"
                      >
                        Use Case Information
                      </motion.h2>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="industry" className="block text-white/80 mb-2 text-sm">
                          Industry*
                        </label>
                        <select
                          id="industry"
                          name="industry"
                          className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                          required
                        >
                          <option value="">Select your industry</option>
                          <option value="technology">Technology</option>
                          <option value="finance">Finance & Banking</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="ecommerce">E-commerce & Retail</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="education">Education</option>
                          <option value="government">Government</option>
                          <option value="other">Other</option>
                        </select>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="useCase" className="block text-white/80 mb-2 text-sm">
                          How do you plan to use CRED-ABILITY?*
                        </label>
                        <textarea
                          id="useCase"
                          name="useCase"
                          className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50 min-h-32"
                          placeholder="Please describe your use case and challenges you're trying to solve"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="timeline" className="block text-white/80 mb-2 text-sm">
                          Implementation Timeline*
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                          required
                        >
                          <option value="">Select your timeline</option>
                          <option value="immediate">Immediate (0-1 month)</option>
                          <option value="near">Near-term (1-3 months)</option>
                          <option value="mid">Mid-term (3-6 months)</option>
                          <option value="long">Long-term (6+ months)</option>
                          <option value="exploring">Just exploring options</option>
                        </select>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={goToPreviousStep}
                          className="border border-white/20 hover:border-white/40 text-white px-6 py-2 rounded-lg transition-all flex items-center"
                        >
                          <Icon icon="heroicons:arrow-left" className="mr-2" />
                          Previous
                        </button>
                        
                        <button
                          type="button"
                          onClick={goToNextStep}
                          className="premium-button flex items-center"
                        >
                          Next Step
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Final Information */}
                  {formStep === 3 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-2xl font-bold text-white mb-6"
                      >
                        Final Information
                      </motion.h2>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="referralSource" className="block text-white/80 mb-2 text-sm">
                          How did you hear about us?
                        </label>
                        <select
                          id="referralSource"
                          name="referralSource"
                          className="w-full bg-slate-gray/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                        >
                          <option value="">Please select</option>
                          <option value="search">Search Engine</option>
                          <option value="social">Social Media</option>
                          <option value="referral">Referral from colleague</option>
                          <option value="event">Conference or Event</option>
                          <option value="press">Press or News</option>
                          <option value="other">Other</option>
                        </select>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20">
                        <h3 className="text-lg font-semibold text-white mb-4">Why Request Access Early?</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <Icon icon="heroicons:check-circle" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Priority onboarding with dedicated support</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="heroicons:check-circle" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Early adopter pricing with significant discounts</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="heroicons:check-circle" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Influence product roadmap with direct feedback</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="heroicons:check-circle" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Access to exclusive early adopter community</span>
                          </li>
                        </ul>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="agreeToTerms"
                            name="agreeToTerms"
                            className="mt-1 mr-2"
                            required
                          />
                          <label htmlFor="agreeToTerms" className="text-white/80 text-sm">
                            I agree to CRED-ABILITY's <a href="#" className="text-electric-blue">Terms of Service</a> and <a href="#" className="text-electric-blue">Privacy Policy</a>. I understand that my information will be used to process my access request.*
                          </label>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={goToPreviousStep}
                          className="border border-white/20 hover:border-white/40 text-white px-6 py-2 rounded-lg transition-all flex items-center"
                        >
                          <Icon icon="heroicons:arrow-left" className="mr-2" />
                          Previous
                        </button>
                        
                        <button
                          type="submit"
                          className="premium-button gold flex items-center"
                        >
                          Submit Application
                          <Icon icon="heroicons:paper-airplane" className="ml-2" />
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="luxury-card text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="heroicons:check" className="text-green-400 text-3xl" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Application Submitted</h2>
              
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Thank you for your interest in CRED-ABILITY! Your application has been received and is being reviewed by our team. We'll contact you shortly with next steps.
              </p>
              
              <div className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20 max-w-lg mx-auto mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">What happens next?</h3>
                <ol className="text-left space-y-3">
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue mr-3 shrink-0">1</span>
                    <span className="text-white/80">Our team reviews your application (1-2 business days)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue mr-3 shrink-0">2</span>
                    <span className="text-white/80">You'll receive an email with access instructions or follow-up questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center text-electric-blue mr-3 shrink-0">3</span>
                    <span className="text-white/80">Schedule an onboarding call with our team (if approved)</span>
                  </li>
                </ol>
              </div>
              
              <button 
                onClick={() => history.push('/')}
                className="premium-button"
              >
                Return to Homepage
              </button>
            </div>
          )}
          
          <div className="mt-8 text-center text-white/50 text-sm">
            <p>Have questions? Contact us at <a href="mailto:access@cred-ability.com" className="text-electric-blue">access@cred-ability.com</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExclusiveAccessPage;