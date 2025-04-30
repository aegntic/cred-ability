import React, { useEffect, useRef, useState } from 'react';
import WaitlistFormPopup from '../waitlist-form-popup';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useHistory } from 'react-router-dom';
import * as THREE from 'three';

interface HeroSectionProps {
  onRequestAccess?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onRequestAccess }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });
  
  const history = useHistory();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Three.js animation setup
  useEffect(() => {
    if (!canvasRef.current) return;

    let animationFrameId: number;
    const container = canvasRef.current;

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x29B6F6,
      transparent: true,
      opacity: 0.8
    });

    // Create points
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation loop
    const animate = () => {
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
      container.removeChild(renderer.domElement);
    };
  }, []);

  const handleScrollDown = () => {
    document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleExclusiveAccess = () => {
    document.getElementById('exclusiveAccess')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLearnMore = () => {
    document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
  };

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
    visible: { y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <>
      <div ref={canvasRef} className="absolute inset-0 z-0" />
      <motion.div 
        ref={ref}
        className="container mx-auto px-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="max-w-4xl">
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block px-4 py-1 rounded-full bg-electric-blue/20 text-electric-blue font-mono text-sm mb-4">
              VERSION 0.4.0
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-electric-blue mb-6"
            variants={itemVariants}
          >
            Intelligent Credential <br/>Management Ecosystem
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 my-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            CRED-<span style={{ fontSize: '1.1em' }}>a</span>BILITY transforms how digital credentials are detected, managed, and secured with intelligent context analysis and proactive security recommendations.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            variants={itemVariants}
          >
            <motion.button 
              className="premium-button gold"
              onClick={handleExclusiveAccess}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Exclusive Access
            </motion.button>
            
            <motion.button 
              className="premium-button"
              onClick={handleLearnMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
          
          <motion.p 
            className="mt-8 text-sm text-white/60"
            variants={itemVariants}
          >
            Currently in private beta. <button onClick={() => setIsWaitlistOpen(true)} className="animated-link">Join our waitlist</button>
          </motion.p>
          
          {/* Waitlist Popup */}
          <WaitlistFormPopup 
            isOpen={isWaitlistOpen} 
            onClose={() => setIsWaitlistOpen(false)} 
          />
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={handleScrollDown}
          whileHover={{ y: 5 }}
          animate={{ 
            y: [0, 5, 0],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-sm mb-2">Scroll Down</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-electric-blue"
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default HeroSection;