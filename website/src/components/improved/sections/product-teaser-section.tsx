import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';
import * as THREE from 'three';

const ProductTeaserSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const controls = useAnimation();
  const meshRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);
  
  // 3D Mesh animation for the credential visualization
  useEffect(() => {
    if (!meshRef.current) return;
    
    const container = meshRef.current;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create a shield-like shape with nodes connected
    const shieldGeometry = new THREE.OctahedronGeometry(1.5, 1);
    const shieldMaterial = new THREE.MeshPhongMaterial({
      color: 0x29B6F6,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
      emissive: 0x29B6F6,
      emissiveIntensity: 0.2
    });
    
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    scene.add(shield);
    
    // Add some node points
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      emissive: 0x29B6F6,
      emissiveIntensity: 0.5
    });
    
    // Create nodes at each vertex of the shield
    const nodes: THREE.Mesh[] = [];
    const shieldVertices = shieldGeometry.getAttribute('position');
    
    for (let i = 0; i < shieldVertices.count; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.x = shieldVertices.getX(i);
      node.position.y = shieldVertices.getY(i);
      node.position.z = shieldVertices.getZ(i);
      scene.add(node);
      nodes.push(node);
    }
    
    // Add light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x29B6F6, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      shield.rotation.x += 0.003;
      shield.rotation.y += 0.003;
      
      // Pulse animation for nodes
      nodes.forEach((node, i) => {
        node.scale.x = 1 + 0.2 * Math.sin(Date.now() * 0.001 + i);
        node.scale.y = 1 + 0.2 * Math.sin(Date.now() * 0.001 + i);
        node.scale.z = 1 + 0.2 * Math.sin(Date.now() * 0.001 + i);
      });
      
      renderer.render(scene, camera);
    };
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      
      // Dispose resources
      shieldGeometry.dispose();
      shieldMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
    };
  }, []);
  
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
  
  const features = [
    {
      icon: 'mdi:shield-lock-outline',
      title: 'Zero-Knowledge Security',
      description: 'Client-side encryption with AES-256-GCM ensures your credentials remain private even from us.'
    },
    {
      icon: 'mdi:brain-circuit',
      title: 'Contextual Intelligence',
      description: 'Our AI analyzes credential relationships to provide personalized security recommendations.'
    },
    {
      icon: 'mdi:shield-check-outline',
      title: 'Risk Assessment',
      description: 'Continuous evaluation of credential security posture with actionable mitigation strategies.'
    },
    {
      icon: 'mdi:account-key-outline',
      title: 'Frictionless Capture',
      description: 'Automatically detect and securely store credentials with minimal user interaction.'
    },
    {
      icon: 'mdi:account-alert-outline',
      title: 'Proactive Protection',
      description: 'Real-time monitoring and alerts for potential security threats before they become breaches.'
    }
  ];
  
  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-6 py-24"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold font-mono text-sm mb-4">
              THE SOLUTION
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gold"
            variants={itemVariants}
          >
            Intelligent Credential Management
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/80 mb-8"
            variants={itemVariants}
          >
            CRED-ABILITY is designed from the ground up to provide a seamless, secure, and intelligent credential management experience.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="glass-card h-full"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl text-gold">
                    <Icon icon={feature.icon} />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="relative h-[500px] flex justify-center items-center"
        >
          {/* 3D visualization */}
          <div className="absolute inset-0 opacity-30 blur-3xl bg-electric-blue/20 rounded-full"></div>
          <div ref={meshRef} className="w-full h-full"></div>
          
          {/* Overlay text */}
          <div className="absolute bottom-10 left-0 right-0 text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-electric-blue/20 border border-electric-blue/30 text-electric-blue font-mono text-sm">
              DEFENSE-IN-DEPTH ENCRYPTION
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductTeaserSection;