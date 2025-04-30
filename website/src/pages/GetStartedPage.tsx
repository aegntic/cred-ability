import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ParticleBackground from '../components/particle-background';

const GetStartedPage: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('overview');

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

  // Animation variants for content elements
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'heroicons:document-text' },
    { id: 'installation', label: 'Installation', icon: 'heroicons:arrow-down-tray' },
    { id: 'configuration', label: 'Configuration', icon: 'heroicons:cog-6-tooth' },
    { id: 'usecases', label: 'Use Cases', icon: 'heroicons:light-bulb' },
    { id: 'faq', label: 'FAQ', icon: 'heroicons:question-mark-circle' }
  ];

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
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="premium-heading text-3xl md:text-5xl">Getting Started with CRED-ABILITY</h1>
            <p className="text-white/80 max-w-3xl mx-auto mt-4">
              A comprehensive guide to help you start your journey with the intelligent credential management ecosystem
            </p>
          </div>
          
          {/* Tabs navigation */}
          <div className="flex flex-wrap justify-center mb-10 gap-2 md:gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id 
                    ? 'bg-electric-blue text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Icon icon={tab.icon} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="luxury-card sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="flex items-center text-electric-blue hover:text-electric-blue/80">
                      <Icon icon="heroicons:document-text" className="mr-2" />
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-electric-blue hover:text-electric-blue/80">
                      <Icon icon="heroicons:video-camera" className="mr-2" />
                      Video Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-electric-blue hover:text-electric-blue/80">
                      <Icon icon="heroicons:chat-bubble-bottom-center-text" className="mr-2" />
                      Community Forum
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-electric-blue hover:text-electric-blue/80">
                      <Icon icon="heroicons:globe-alt" className="mr-2" />
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-electric-blue hover:text-electric-blue/80">
                      <Icon icon="heroicons:academic-cap" className="mr-2" />
                      Learning Resources
                    </a>
                  </li>
                </ul>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Need Help?</h3>
                  <button className="premium-button w-full flex items-center justify-center">
                    <Icon icon="heroicons:chat-bubble-oval-left-ellipsis" className="mr-2" />
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:col-span-3">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="luxury-card"
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <motion.h2 
                      variants={itemVariants}
                      className="text-2xl font-bold text-white"
                    >
                      CRED-ABILITY Overview
                    </motion.h2>
                    
                    <motion.div variants={itemVariants}>
                      <p className="text-white/80 mb-4">
                        CRED-ABILITY is a comprehensive credential management ecosystem designed to transform how digital identities and sensitive credentials are captured, managed, and secured across digital platforms.
                      </p>
                      
                      <p className="text-white/80 mb-4">
                        Our system provides intelligent credential detection, contextual analysis, and proactive security recommendations with minimal user friction.
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">Core Components</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0">
                              <Icon icon="heroicons:cursor-arrow-rays" className="text-blue-400" />
                            </div>
                            <h4 className="text-lg font-medium text-white">Browser Integration Engine</h4>
                          </div>
                          <p className="text-white/70 text-sm">
                            Automatically detects credentials across web applications with credential detection patterns, confidence scoring, and context extraction.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 shrink-0">
                              <Icon icon="heroicons:server" className="text-purple-400" />
                            </div>
                            <h4 className="text-lg font-medium text-white">MCP Server</h4>
                          </div>
                          <p className="text-white/70 text-sm">
                            Processes credential events and coordinates between components with classification system and context graph building.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3 shrink-0">
                              <Icon icon="heroicons:lock-closed" className="text-amber-400" />
                            </div>
                            <h4 className="text-lg font-medium text-white">Credential Vault</h4>
                          </div>
                          <p className="text-white/70 text-sm">
                            Securely stores encrypted credentials using AES-256-GCM with hierarchical key structure for maximum security.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3 shrink-0">
                              <Icon icon="heroicons:brain" className="text-green-400" />
                            </div>
                            <h4 className="text-lg font-medium text-white">Intelligence Layer</h4>
                          </div>
                          <p className="text-white/70 text-sm">
                            Analyzes credential relationships to provide personalized security recommendations and proactive protection.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Installation Tab */}
                {activeTab === 'installation' && (
                  <div className="space-y-8">
                    <motion.h2 
                      variants={itemVariants}
                      className="text-2xl font-bold text-white"
                    >
                      Installation Guide
                    </motion.h2>
                    
                    <motion.p variants={itemVariants} className="text-white/80">
                      Getting started with CRED-ABILITY is straightforward. Follow the steps below to install and configure the system.
                    </motion.p>
                  </div>
                )}

                {/* Placeholder content for other tabs */}
                {activeTab === 'configuration' && (
                  <div className="space-y-8">
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white">
                      Configuration Guide
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-white/80">
                      Configuration content will be displayed here.
                    </motion.p>
                  </div>
                )}

                {activeTab === 'usecases' && (
                  <div className="space-y-8">
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white">
                      Use Cases
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-white/80">
                      Use cases content will be displayed here.
                    </motion.p>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-8">
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white">
                      Frequently Asked Questions
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-white/80">
                      FAQ content will be displayed here.
                    </motion.p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStartedPage;