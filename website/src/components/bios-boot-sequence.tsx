import React from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Spinner } from '@heroui/react';

interface BiosBootSequenceProps {
  onComplete: () => void;
}

interface TextSequence {
  text: string;
  delay: number;
}

const BiosBootSequence: React.FC<BiosBootSequenceProps> = ({ onComplete }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentText, setCurrentText] = React.useState<string[]>([]);
  const [bootProgress, setBootProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  const textSequences: TextSequence[] = [
    { text: "> INITIALIZING CREDENTIAL SECURITY PROTOCOLS", delay: 200 },
    { text: "> SCANNING FOR VULNERABLE ACCESS POINTS...", delay: 800 },
    { text: "> ESTABLISHING SECURE CONNECTION...", delay: 1200 },
    { text: "> DEPLOYING CRED-ABILITY ENGINE v0.4.0", delay: 2000 },
    { text: "> SYSTEM READY", delay: 4500 }
  ];

  React.useEffect(() => {
    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0A2342, 1);
    
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    
    camera.position.z = 5;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x29B6F6, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create particle system for final animation
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
      
      // Start with green color
      colors[i] = 0; // R
      colors[i + 1] = 1; // G
      colors[i + 2] = 0; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particleSystem.visible = false;
    scene.add(particleSystem);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      
      if (particleSystem.visible) {
        particleSystem.rotation.y += delta * 0.2;
        particleSystem.rotation.x += delta * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle text sequences
    let textIndex = 0;
    
    const displayNextText = () => {
      if (textIndex >= textSequences.length) {
        // Start final animation
        startFinalAnimation();
        return;
      }
      
      const sequence = textSequences[textIndex];
      
      // Animate text typing
      const text = sequence.text;
      let currentTextValue = '';
      let charIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (charIndex >= text.length) {
          clearInterval(typingInterval);
          
          // Update progress
          setBootProgress((textIndex + 1) / textSequences.length * 100);
          
          // Move to next text after delay
          setTimeout(() => {
            textIndex++;
            displayNextText();
          }, sequence.delay);
          
          return;
        }
        
        currentTextValue += text.charAt(charIndex);
        setCurrentText(prev => [...prev, currentTextValue]);
        charIndex++;
      }, 50);
    };
    
    const startFinalAnimation = () => {
      // Make particle system visible
      particleSystem.visible = true;
      
      // Animate color transition to blue
      const colorAnimation = { t: 0 };
      gsap.to(colorAnimation, {
        t: 1,
        duration: 2,
        onUpdate: () => {
          const colors = particleSystem.geometry.attributes.color.array;
          for (let i = 0; i < colors.length; i += 3) {
            colors[i] = 0; // R
            colors[i + 1] = 1 - colorAnimation.t; // G decreases
            colors[i + 2] = colorAnimation.t; // B increases
          }
          particleSystem.geometry.attributes.color.needsUpdate = true;
        },
        onComplete: () => {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      });
    };
    
    // Start the sequence
    setTimeout(() => {
      displayNextText();
    }, 1000);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-deep-blue">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      <div className="z-10 w-full max-w-2xl p-8 font-mono">
        <div className="mb-8 terminal-text">
          {currentText.map((text, index) => (
            <div key={index} className="mb-2">
              {text}
            </div>
          ))}
        </div>
        
        <div className="w-full bg-slate-gray bg-opacity-30 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-electric-blue transition-all duration-500 ease-out"
            style={{ width: `${bootProgress}%` }}
          />
        </div>
        
        {isComplete && (
          <div className="mt-8 flex items-center justify-center">
            <Spinner color="primary" size="lg" />
            <span className="ml-4 text-electric-blue">Loading interface...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiosBootSequence;