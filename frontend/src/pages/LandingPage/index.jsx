import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import PricingPlans from "./components/PricingPlans";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { useLenis } from "../../hooks/useLenis";
import { useGSAP } from "../../hooks/useGSAP";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const lenis = useLenis();
  const containerRef = useGSAP(lenis);

  useEffect(() => {
    if (!lenis) return;

    // Hero section animations
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
    heroTl.from(
      ".hero-subtitle",
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5"
    );
    heroTl.from(
      ".hero-cta",
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Features section animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: "#features",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // How it works animations
    gsap.from(".step-item", {
      scrollTrigger: {
        trigger: "#how-it-works",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      x: -100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: "power3.out",
    });

    // Pricing plans animations
    gsap.from(".pricing-card", {
      scrollTrigger: {
        trigger: "#pricing",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Testimonials animations
    gsap.from(".testimonial-card", {
      scrollTrigger: {
        trigger: "#testimonials",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    // CTA section animations
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Parallax effects
    gsap.to(".parallax-bg", {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: (i, target) => -target.offsetHeight * 0.5,
      ease: "none",
    });

    // Cleanup function
    return () => {
      ScrollTrigger.killAll();
    };
  }, [lenis]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <div id="features">
        <Features />
      </div>

      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Pricing Plans Section */}
      <div id="pricing">
        <PricingPlans />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* Call to Action Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
