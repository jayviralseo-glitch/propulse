import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Show loading state briefly
    setIsLoading(true);
    setIsVisible(false);
    setKey((prev) => prev + 1);

    // Staggered animation for smoother feel
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(visibleTimer);
    };
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={key}
      className={`transition-all duration-800 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
