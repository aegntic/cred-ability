import React, { useRef, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './sections/hero-section';
import ProblemSection from './sections/problem-section';
import ProductTeaserSection from './sections/product-teaser-section';
import HowItWorksSection from './sections/how-it-works-section';
import ExclusiveAccessSection from './sections/exclusive-access-section';
import FaqSection from './sections/faq-section';
import FinalCtaSection from './sections/final-cta-section';
import NavigationBar from './navigation-bar';
import ParticleBackground from './particle-background';
import { ExclusiveAccessFormData } from '../types/form-types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface RouteParams {
  sectionId?: string;
}

const MainLayout: React.FC = () => {
  const { sectionId } = useParams<RouteParams>();
  const history = useHistory();
  const [activeSection, setActiveSection] = useState<string>(sectionId || 'hero');
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    problem: useRef<HTMLDivElement>(null),
    teaser: useRef<HTMLDivElement>(null),
    howItWorks: useRef<HTMLDivElement>(null),
    exclusiveAccess: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    finalCta: useRef<HTMLDivElement>(null),
  };

  // Handle section change via URL
  useEffect(() => {
    if (sectionId && Object.keys(sectionRefs).includes(sectionId)) {
      setActiveSection(sectionId);
    } else if (!sectionId) {
      setActiveSection('hero');
      history.replace('/hero');
    }
  }, [sectionId, history]);

  // Setup scroll animations
  useEffect(() => {
    if (!sectionsRef.current) return;

    // Clear any existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Create scroll triggers for each section
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (!ref.current) return;
      
      // Create smooth scroll trigger for each section
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (activeSection !== id) {
            setActiveSection(id);
            history.replace(`/${id}`, { scroll: false });
          }
        },
        onEnterBack: () => {
          if (activeSection !== id) {
            setActiveSection(id);
            history.replace(`/${id}`, { scroll: false });
          }
        },
        markers: false // Set to true for debugging
      });
      
      // Animate sections as they come into view
      gsap.fromTo(ref.current, 
        { 
          opacity: 0, 
          y: 50 
        }, 
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom-=100",
            end: "center center",
            toggleActions: "play none none reverse",
          }
        }
      );
    });
    
    return () => {
      // Clean up all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle manual navigation click
  const handleNavigate = (sectionId: string) => {
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle exclusive access request with form data
  const handleExclusiveAccess = (formData: ExclusiveAccessFormData) => {
    // Pass the form data to the exclusive access page using location state
    history.push('/exclusive-access', { formData });
  };
  
  // Handle get started navigation
  const handleGetStarted = () => {
    history.push('/get-started');
  };

  return (
    <div className="relative" ref={mainContainerRef}>
      <ParticleBackground />
      
      {/* Luxury glass-effect navigation */}
      <NavigationBar 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
      />
      
      {/* Content container */}
      <div ref={sectionsRef} className="relative">
        <section 
          ref={sectionRefs.hero}
          className="min-h-screen py-20 section-container"
          id="hero"
        >
          <HeroSection 
            onRequestAccess={() => handleExclusiveAccess({
              fullName: '',
              email: '',
              companyName: '',
              companySize: '',
              agreeToTerms: false
            })}
          />
        </section>
        
        <section 
          ref={sectionRefs.problem}
          className="min-h-screen py-20 section-container"
          id="problem"
        >
          <ProblemSection />
        </section>
        
        <section 
          ref={sectionRefs.teaser}
          className="min-h-screen py-20 section-container"
          id="teaser"
        >
          <ProductTeaserSection />
        </section>
        
        <section 
          ref={sectionRefs.howItWorks}
          className="min-h-screen py-20 section-container"
          id="howItWorks"
        >
          <HowItWorksSection />
        </section>
        
        <section 
          ref={sectionRefs.exclusiveAccess}
          className="min-h-screen py-20 section-container"
          id="exclusiveAccess"
        >
          <ExclusiveAccessSection 
            onRequestAccess={handleExclusiveAccess} 
          />
        </section>
        
        <section 
          ref={sectionRefs.faq}
          className="min-h-screen py-20 section-container"
          id="faq"
        >
          <FaqSection />
        </section>
        
        <section 
          ref={sectionRefs.finalCta}
          className="min-h-screen py-20 section-container"
          id="finalCta"
        >
          <FinalCtaSection 
            onRequestAccess={() => handleExclusiveAccess({
              fullName: '',
              email: '',
              companyName: '',
              companySize: '',
              agreeToTerms: false
            })}
            onGetStarted={handleGetStarted}
          />
        </section>
      </div>
    </div>
  );
};

export default MainLayout;