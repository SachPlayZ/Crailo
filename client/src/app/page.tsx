"use client";

import { useState, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyCrailoSection from "@/components/WhyCrailoSection";
import ValidatorSection from "@/components/ValidatorSection";
import ScenariosSection from "@/components/ScenariosSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

// Custom hook for intersection observer
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-50px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

export default function CrailoLanding() {
  // Intersection observer refs
  const [heroRef, heroInView] = useInView();
  const [howItWorksRef, howItWorksInView] = useInView();
  const [whyCrailoRef, whyCrailoInView] = useInView();
  const [validatorsRef, validatorsInView] = useInView();
  const [scenariosRef, scenariosInView] = useInView();
  const [testimonialsRef, testimonialsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  return (
    <>
      {/* Hero Section */}
      <div ref={heroRef}>
        <HeroSection heroInView={heroInView} />
      </div>

      {/* How It Works */}
      <div id="how-it-works" ref={howItWorksRef}>
        <HowItWorksSection howItWorksInView={howItWorksInView} />
      </div>

      {/* Why Crailo */}
      <div id="why-crailo" ref={whyCrailoRef}>
        <WhyCrailoSection whyCrailoInView={whyCrailoInView} />
      </div>

      {/* Validator System */}
      <div id="validators" ref={validatorsRef}>
        <ValidatorSection validatorsInView={validatorsInView} />
      </div>

      {/* Case Scenarios */}
      <div id="scenarios" ref={scenariosRef}>
        <ScenariosSection scenariosInView={scenariosInView} />
      </div>

      {/* Testimonials */}
      <div id="community" ref={testimonialsRef}>
        <TestimonialsSection testimonialsInView={testimonialsInView} />
      </div>

      {/* CTA Footer */}
      <div ref={ctaRef}>
        <CTASection ctaInView={ctaInView} />
      </div>
    </>
  );
}
