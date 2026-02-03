import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = (lenisInstance) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lenisInstance || !containerRef.current) return;

    // Update ScrollTrigger on Lenis scroll
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Create a proxy for ScrollTrigger
    const gsapProxy = {
      scrollTop: 0,
      scrollHeight: 0,
      offsetHeight: 0,
    };

    lenisInstance.on("scroll", (e) => {
      gsapProxy.scrollTop = e.scroll;
      gsapProxy.scrollHeight = e.limit;
      gsapProxy.offsetHeight = e.limit;
    });

    // Override ScrollTrigger's scrollTop getter
    Object.defineProperty(ScrollTrigger, "scrollTop", {
      get: () => gsapProxy.scrollTop,
    });

    // Override ScrollTrigger's scrollHeight getter
    Object.defineProperty(ScrollTrigger, "scrollHeight", {
      get: () => gsapProxy.scrollHeight,
    });

    // Override ScrollTrigger's offsetHeight getter
    Object.defineProperty(ScrollTrigger, "offsetHeight", {
      get: () => gsapProxy.offsetHeight,
    });

    // Cleanup
    return () => {
      if (lenisInstance) {
        lenisInstance.off("scroll", ScrollTrigger.update);
      }
      ScrollTrigger.killAll();
    };
  }, [lenisInstance]);

  return containerRef;
};
