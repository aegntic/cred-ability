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
                            Securely stores credentials using AES-256-GCM encryption, Argon2id key derivation, and key rotation capabilities.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-4 rounded-lg">
                          <div className="flex items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3 shrink-0">
                              <Icon icon="heroicons:light-bulb" className="text-green-400" />
                            </div>
                            <h4 className="text-lg font-medium text-white">Intelligence Layer</h4>
                          </div>
                          <p className="text-white/70 text-sm">
                            Analyzes context and generates security recommendations with risk assessment and rotation planning.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">Key Benefits</h3>
                      
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Icon icon="heroicons:check-circle" className="text-electric-blue mr-3 mt-1 shrink-0" />
                          <div>
                            <h4 className="text-lg font-medium text-white">Automatic Credential Detection</h4>
                            <p className="text-white/70">No more manual entry - credentials are detected as you use them</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="heroicons:check-circle" className="text-electric-blue mr-3 mt-1 shrink-0" />
                          <div>
                            <h4 className="text-lg font-medium text-white">Contextual Understanding</h4>
                            <p className="text-white/70">Maps relationships between credentials to understand dependencies</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="heroicons:check-circle" className="text-electric-blue mr-3 mt-1 shrink-0" />
                          <div>
                            <h4 className="text-lg font-medium text-white">Proactive Security</h4>
                            <p className="text-white/70">Get recommendations before breaches occur, not after</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Icon icon="heroicons:check-circle" className="text-electric-blue mr-3 mt-1 shrink-0" />
                          <div>
                            <h4 className="text-lg font-medium text-white">Frictionless Experience</h4>
                            <p className="text-white/70">Security enhancement without user burden</p>
                          </div>
                        </li>
                      </ul>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <div className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20">
                        <h3 className="text-xl font-semibold text-white mb-3">Ready to dive in?</h3>
                        <p className="text-white/80 mb-4">
                          Start with our installation guide to set up CRED-ABILITY in your environment.
                        </p>
                        <button 
                          onClick={() => setActiveTab('installation')}
                          className="premium-button flex items-center"
                        >
                          Go to Installation
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </button>
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
                    
                    <motion.div variants={itemVariants}>
                      <p className="text-white/80 mb-6">
                        Follow these steps to install CRED-ABILITY in your environment. The installation process varies depending on your deployment type.
                      </p>
                      
                      <div className="bg-white/5 p-6 rounded-lg mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Prerequisites</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Icon icon="heroicons:check" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Node.js (v18+)</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="heroicons:check" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Docker and Docker Compose</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="heroicons:check" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Git</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="heroicons:check" className="text-electric-blue mr-2 mt-1 shrink-0" />
                            <span className="text-white/80">Access to your organization's credential infrastructure</span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">1. Clone the Repository</h3>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">git clone https://github.com/cred-ability/cred-ability.git</pre>
                        <pre className="text-white/90">cd cred-ability</pre>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">2. Install Dependencies</h3>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">npm install</pre>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">3. Start Development Environment</h3>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">docker-compose up -d</pre>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">4. Initialize the Vault</h3>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">npm run vault:init</pre>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">5. Set Up the Browser Extension</h3>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">cd browser-extension</pre>
                        <pre className="text-white/90">npm install</pre>
                        <pre className="text-white/90">npm run build</pre>
                      </div>
                      
                      <p className="text-white/80 mb-2">Then load the extension in your browser:</p>
                      <ol className="list-decimal list-inside space-y-1 text-white/80 pl-4 mb-6">
                        <li>Open Chrome/Firefox/Edge</li>
                        <li>Navigate to extensions page</li>
                        <li>Enable developer mode</li>
                        <li>Click "Load unpacked" and select the build folder</li>
                      </ol>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">6. Verify Installation</h3>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">npm run verify</pre>
                      </div>
                      
                      <p className="text-white/80">
                        If everything is working correctly, you should see a success message and the CRED-ABILITY icon in your browser's toolbar.
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <div className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20">
                        <h3 className="text-xl font-semibold text-white mb-3">Next Steps</h3>
                        <p className="text-white/80 mb-4">
                          Now that you've installed CRED-ABILITY, it's time to configure it for your specific needs.
                        </p>
                        <button 
                          onClick={() => setActiveTab('configuration')}
                          className="premium-button flex items-center"
                        >
                          Go to Configuration
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* Configuration Tab */}
                {activeTab === 'configuration' && (
                  <div className="space-y-8">
                    <motion.h2 
                      variants={itemVariants}
                      className="text-2xl font-bold text-white"
                    >
                      Configuration Guide
                    </motion.h2>
                    
                    <motion.div variants={itemVariants}>
                      <p className="text-white/80 mb-6">
                        After installation, you'll need to configure CRED-ABILITY to match your organization's security requirements and credential management needs.
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">Environment Configuration</h3>
                      
                      <p className="text-white/80 mb-4">
                        Create a <code>.env</code> file based on the example template:
                      </p>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">cp .env.example .env</pre>
                        <pre className="text-white/90">nano .env  # Edit with your settings</pre>
                      </div>
                      
                      <p className="text-white/80 mb-2">Key configuration parameters:</p>
                      <ul className="space-y-2 text-white/80 pl-4 mb-6">
                        <li><code>SERVER_PORT</code>: Port for the MCP server (default: 3000)</li>
                        <li><code>ENCRYPTION_ALGORITHM</code>: Encryption algorithm (default: aes-256-gcm)</li>
                        <li><code>KEY_DERIVATION</code>: Key derivation method (default: argon2id)</li>
                        <li><code>LOGGING_LEVEL</code>: Logging verbosity (default: info)</li>
                        <li><code>DB_CONNECTION</code>: Database connection string</li>
                      </ul>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
                      
                      <div className="bg-white/5 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-medium text-white mb-2">Master Password Requirements</h4>
                        <ul className="space-y-1 text-white/80 pl-4">
                          <li>Minimum length: 12 characters</li>
                          <li>Must include uppercase, lowercase, numbers, and symbols</li>
                          <li>Cannot be a dictionary word or common password</li>
                          <li>Cannot contain personal information</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-medium text-white mb-2">Key Rotation Policy</h4>
                        <ul className="space-y-1 text-white/80 pl-4">
                          <li>Master Key: Every 90 days</li>
                          <li>Key Encryption Keys (KEKs): Every 60 days</li>
                          <li>Data Encryption Keys (DEKs): Every 30 days</li>
                        </ul>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">Browser Extension Configuration</h3>
                      
                      <p className="text-white/80 mb-4">
                        Configure the browser extension through the extension options page:
                      </p>
                      
                      <ol className="list-decimal list-inside space-y-2 text-white/80 pl-4 mb-6">
                        <li>Click the CRED-ABILITY icon in your browser toolbar</li>
                        <li>Select "Options" or "Settings"</li>
                        <li>Configure the following settings:
                          <ul className="list-disc list-inside pl-4 pt-2">
                            <li>Server connection URL</li>
                            <li>Detection sensitivity (High/Medium/Low)</li>
                            <li>Credential types to monitor</li>
                            <li>Auto-capture settings</li>
                            <li>Notification preferences</li>
                          </ul>
                        </li>
                        <li>Save your settings</li>
                      </ol>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-xl font-semibold text-white mb-4">Advanced Configuration</h3>
                      
                      <p className="text-white/80 mb-4">
                        For advanced users, you can customize detection patterns, recommendation algorithms, and more:
                      </p>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">cd src/config</pre>
                        <pre className="text-white/90">cp detection-patterns.json detection-patterns.custom.json</pre>
                        <pre className="text-white/90">cp recommendation-rules.json recommendation-rules.custom.json</pre>
                        <pre className="text-white/90">nano detection-patterns.custom.json  # Edit detection patterns</pre>
                        <pre className="text-white/90">nano recommendation-rules.custom.json  # Edit recommendation rules</pre>
                      </div>
                      
                      <p className="text-white/80">
                        After modifying custom configurations, restart the system:
                      </p>
                      
                      <div className="bg-slate-gray/20 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                        <pre className="text-white/90">docker-compose restart</pre>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <div className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20">
                        <h3 className="text-xl font-semibold text-white mb-3">Ready to see it in action?</h3>
                        <p className="text-white/80 mb-4">
                          Now that you've configured CRED-ABILITY, check out our use cases to see how it can benefit your organization.
                        </p>
                        <button 
                          onClick={() => setActiveTab('usecases')}
                          className="premium-button flex items-center"
                        >
                          Explore Use Cases
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* Use Cases Tab */}
                {activeTab === 'usecases' && (
                  <div className="space-y-8">
                    <motion.h2 
                      variants={itemVariants}
                      className="text-2xl font-bold text-white"
                    >
                      Use Cases
                    </motion.h2>
                    
                    <motion.div variants={itemVariants}>
                      <p className="text-white/80 mb-6">
                        CRED-ABILITY is designed to solve a wide range of credential management challenges across different industries and use cases.
                      </p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="luxury-card h-full">
                        <div className="flex items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 shrink-0">
                            <Icon icon="heroicons:code-bracket" className="text-blue-400 text-xl" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Developer Use Case</h3>
                        </div>
                        
                        <p className="text-white/80 mb-4">
                          Software development teams dealing with numerous API keys, access tokens, and credentials across multiple platforms and environments.
                        </p>
                        
                        <h4 className="text-lg font-medium text-white mb-2">Challenges:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Managing credentials across development, staging, and production</li>
                          <li>Tracking API key usage across microservices</li>
                          <li>Ensuring proper credential rotation</li>
                          <li>Preventing credential leakage in code</li>
                        </ul>
                        
                        <h4 className="text-lg font-medium text-white mb-2">CRED-ABILITY Solution:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Automatic detection of credentials in code and config files</li>
                          <li>Mapping service dependencies to understand potential impacts</li>
                          <li>Proactive credential rotation recommendations</li>
                          <li>Secure sharing of credentials within teams</li>
                        </ul>
                        
                        <div className="mt-auto pt-4">
                          <button className="text-electric-blue flex items-center hover:underline">
                            See developer case study
                            <Icon icon="heroicons:arrow-right" className="ml-1" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="luxury-card h-full">
                        <div className="flex items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4 shrink-0">
                            <Icon icon="heroicons:building-office-2" className="text-green-400 text-xl" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Enterprise Use Case</h3>
                        </div>
                        
                        <p className="text-white/80 mb-4">
                          Large organizations with complex credential ecosystems, numerous employees, and strict compliance requirements.
                        </p>
                        
                        <h4 className="text-lg font-medium text-white mb-2">Challenges:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Managing credentials across thousands of employees</li>
                          <li>Ensuring compliance with regulatory requirements</li>
                          <li>Preventing credential-based attacks</li>
                          <li>Auditing credential usage</li>
                        </ul>
                        
                        <h4 className="text-lg font-medium text-white mb-2">CRED-ABILITY Solution:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Centralized credential management with role-based access</li>
                          <li>Automated compliance reporting</li>
                          <li>Advanced threat detection and risk assessment</li>
                          <li>Comprehensive audit trails</li>
                        </ul>
                        
                        <div className="mt-auto pt-4">
                          <button className="text-electric-blue flex items-center hover:underline">
                            See enterprise case study
                            <Icon icon="heroicons:arrow-right" className="ml-1" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="luxury-card h-full">
                        <div className="flex items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 shrink-0">
                            <Icon icon="heroicons:shield-check" className="text-purple-400 text-xl" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Security Team Use Case</h3>
                        </div>
                        
                        <p className="text-white/80 mb-4">
                          Security professionals responsible for protecting organizational assets and preventing breaches.
                        </p>
                        
                        <h4 className="text-lg font-medium text-white mb-2">Challenges:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Detecting credential exposure</li>
                          <li>Identifying high-risk credentials</li>
                          <li>Enforcing security policies</li>
                          <li>Responding to potential credential compromises</li>
                        </ul>
                        
                        <h4 className="text-lg font-medium text-white mb-2">CRED-ABILITY Solution:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Real-time credential exposure detection</li>
                          <li>Risk-based credential prioritization</li>
                          <li>Policy enforcement automation</li>
                          <li>Incident response workflow integration</li>
                        </ul>
                        
                        <div className="mt-auto pt-4">
                          <button className="text-electric-blue flex items-center hover:underline">
                            See security team case study
                            <Icon icon="heroicons:arrow-right" className="ml-1" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="luxury-card h-full">
                        <div className="flex items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mr-4 shrink-0">
                            <Icon icon="heroicons:user-group" className="text-amber-400 text-xl" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Individual Use Case</h3>
                        </div>
                        
                        <p className="text-white/80 mb-4">
                          Individuals managing personal credentials across dozens of online services and applications.
                        </p>
                        
                        <h4 className="text-lg font-medium text-white mb-2">Challenges:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Managing 100+ personal credentials</li>
                          <li>Creating and remembering strong passwords</li>
                          <li>Recognizing password reuse risks</li>
                          <li>Maintaining secure personal digital identity</li>
                        </ul>
                        
                        <h4 className="text-lg font-medium text-white mb-2">CRED-ABILITY Solution:</h4>
                        <ul className="space-y-1 text-white/80 pl-4 mb-4">
                          <li>Automatic credential detection and storage</li>
                          <li>Password strength assessment</li>
                          <li>Reuse detection and recommendations</li>
                          <li>Simplified credential management across devices</li>
                        </ul>
                        
                        <div className="mt-auto pt-4">
                          <button className="text-electric-blue flex items-center hover:underline">
                            See individual user testimonial
                            <Icon icon="heroicons:arrow-right" className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <div className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20">
                        <h3 className="text-xl font-semibold text-white mb-3">Have more questions?</h3>
                        <p className="text-white/80 mb-4">
                          Check out our frequently asked questions to learn more about CRED-ABILITY.
                        </p>
                        <button 
                          onClick={() => setActiveTab('faq')}
                          className="premium-button flex items-center"
                        >
                          View FAQ
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-8">
                    <motion.h2 
                      variants={itemVariants}
                      className="text-2xl font-bold text-white"
                    >
                      Frequently Asked Questions
                    </motion.h2>
                    
                    <motion.div variants={itemVariants}>
                      <p className="text-white/80 mb-6">
                        Find answers to common questions about CRED-ABILITY's features, functionality, and implementation.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">What makes CRED-ABILITY different from traditional password managers?</h3>
                          <p className="text-white/80">
                            Unlike traditional password managers that require manual entry, CRED-ABILITY automatically detects credentials as you use them, analyzes their relationships, and provides proactive security recommendations. It understands how credentials are connected and gives actionable insights for improving your security posture.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">How secure is the CRED-ABILITY credential vault?</h3>
                          <p className="text-white/80">
                            CRED-ABILITY uses AES-256-GCM encryption with Argon2id key derivation, which represents military-grade security. We implement a zero-knowledge architecture, meaning your credentials are encrypted locally and only you have access to the decryption keys. Our defense-in-depth approach includes envelope encryption with a hierarchical key structure.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">What types of credentials can CRED-ABILITY manage?</h3>
                          <p className="text-white/80">
                            CRED-ABILITY can detect and manage a wide range of credentials including passwords, API keys, OAuth tokens, secret keys, personal access tokens, and more. Our intelligent detection engine recognizes patterns across various platforms and service types.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">Is CRED-ABILITY available for enterprise use?</h3>
                          <p className="text-white/80">
                            Yes, CRED-ABILITY offers enterprise-focused solutions with team sharing capabilities, role-based access control, compliance modules, and advanced security features. Enterprise deployments include SSO integration, audit reporting, and custom deployment options.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">How does the intelligence layer work?</h3>
                          <p className="text-white/80">
                            The intelligence layer analyzes the context and relationships between your credentials, mapping services and dependencies. It assesses risk based on multiple factors, generates prioritized security recommendations, and creates rotation plans based on credential usage patterns and vulnerabilities.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">What browsers are supported?</h3>
                          <p className="text-white/80">
                            CRED-ABILITY currently supports Chrome, Firefox, Edge, and Safari. We're actively working on expanding browser support to cover additional platforms.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">Does CRED-ABILITY require an internet connection?</h3>
                          <p className="text-white/80">
                            CRED-ABILITY can operate in both online and offline modes. While connected, it provides full functionality including synchronization and real-time security recommendations. In offline mode, it continues to provide secure credential access and basic detection capabilities.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-white mb-2">Can I migrate from my existing password manager?</h3>
                          <p className="text-white/80">
                            Yes, CRED-ABILITY supports importing credentials from most popular password managers including LastPass, 1Password, Dashlane, and Bitwarden. Our migration assistant will guide you through the process of securely transferring your credentials.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <div className="bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/20">
                        <h3 className="text-xl font-semibold text-white mb-3">Ready to get started?</h3>
                        <p className="text-white/80 mb-4">
                          Request exclusive access to CRED-ABILITY and transform your credential security today.
                        </p>
                        <Link 
                          to="/exclusive-access"
                          className="premium-button gold flex items-center justify-center"
                        >
                          Request Exclusive Access
                          <Icon icon="heroicons:arrow-right" className="ml-2" />
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-gray/30 backdrop-blur-sm mt-20 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-electric-blue font-bold text-xl mr-2">CRED-ABILITY</span>
              <div className="h-3 w-3 rounded-full bg-electric-blue"></div>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">API</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Community</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 md:mb-0">
              &copy; 2025 CRED-ABILITY. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-white/50 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-white/50 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-white/50 hover:text-white text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GetStartedPage;