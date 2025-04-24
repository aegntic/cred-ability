import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup with better perspective for luxury feel
    const camera = new THREE.PerspectiveCamera(
      50, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    camera.position.z = 500;
    
    // Renderer with anti-aliasing for smoother edges
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance' // Optimize for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particle system - optimize particle count based on device capability
    // Reduce particle count for better performance
    const isMobile = window.innerWidth < 768;
    const isHighEnd = !isMobile && window.navigator.hardwareConcurrency > 4;
    const particleCount = isMobile ? 800 : (isHighEnd ? 2000 : 1500);
    
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Particles will form a subtle grid pattern
    for (let i = 0; i < particleCount; i++) {
      // Position with slight randomness around grid points
      const x = (Math.random() - 0.5) * window.innerWidth * 1.5;
      const y = (Math.random() - 0.5) * window.innerHeight * 1.5;
      // Reduce z-range for better performance
      const z = (Math.random() - 0.5) * 300;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Use brand colors with varying opacity
      // Electric blue and gold accents
      const colorChoice = Math.random();
      if (colorChoice < 0.85) {
        // Electric blue particles (primary)
        colors[i * 3] = 0.16;     // R: 41/255
        colors[i * 3 + 1] = 0.71;  // G: 182/255
        colors[i * 3 + 2] = 0.96;  // B: 246/255
      } else {
        // Gold accent particles
        colors[i * 3] = 1.0;      // R: 255/255
        colors[i * 3 + 1] = 0.75;  // G: 193/255
        colors[i * 3 + 2] = 0.03;  // B: 7/255
      }
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Use custom shaders for more luxurious particles
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.5 : 2, // Smaller particles on mobile
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Add ambient light for subtle particle illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Handle mouse movement for interactive particles
    const mouse = new THREE.Vector2();
    const targetMouse = new THREE.Vector2();
    const windowHalf = new THREE.Vector2(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    
    const handleMouseMove = (event: MouseEvent) => {
      targetMouse.x = (event.clientX - windowHalf.x) / windowHalf.x;
      targetMouse.y = (event.clientY - windowHalf.y) / windowHalf.y;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Performance optimized animation loop
    const clock = new THREE.Clock();
    let lastTime = 0;
    const frameRate = isMobile ? 30 : 60; // Lower framerate on mobile
    const interval = 1 / frameRate;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const currentTime = clock.getElapsedTime();
      const deltaTime = currentTime - lastTime;
      
      // Throttle updates for better performance
      if (deltaTime > interval) {
        // Smooth mouse tracking
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;
        
        // Rotate particle system based on mouse position for interactivity
        particleSystem.rotation.x = mouse.y * 0.2; // Reduced from 0.3 to 0.2
        particleSystem.rotation.y = mouse.x * 0.2; // Reduced from 0.3 to 0.2
        
        // Subtle continuous movement
        particleSystem.rotation.z += 0.0005; // Reduced from 0.001 to 0.0005
        
        // Only update particles every other frame for better performance
        if (Math.floor(currentTime * 2) % 2 === 0) {
          // Optimize by only updating a portion of particles each frame
          const positions = particleSystem.geometry.attributes.position.array as Float32Array;
          const updateAmount = isMobile ? particleCount / 4 : particleCount / 2;
          const startIdx = Math.floor(Math.random() * (particleCount - updateAmount));
          
          const time = currentTime * 0.0005;
          
          for (let i = startIdx; i < startIdx + updateAmount; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];
            
            // Apply subtle wave effect
            positions[i3 + 2] = z + Math.sin(time + x * 0.01) * 0.3; // Reduced magnitude from 0.5 to 0.3
          }
          
          particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        renderer.render(scene, camera);
        lastTime = currentTime;
      }
    };
    
    animate();
    
    // Responsive handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 bg-gradient-to-b from-deep-blue to-slate-gray"
    />
  );
};

export default ParticleBackground;