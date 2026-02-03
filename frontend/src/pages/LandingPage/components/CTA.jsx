import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  CheckCircle,
  Users,
  Play,
  Download,
  MessageCircle,
  ArrowUp,
} from "lucide-react";

const CTA = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFloatingButton(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDemoClick = () => {
    // You can replace this with actual demo video functionality
    // For now, we'll just show an alert
    alert(
      "Demo video would play here! This could open a modal with a video player or redirect to a demo page."
    );
  };

  const handleExtensionDownload = () => {
    // This could redirect to the extension download page or trigger download
    window.open(
      "https://chrome.google.com/webstore/detail/your-extension-id",
      "_blank"
    );
  };

  const handleContactClick = () => {
    // This could open a contact form or redirect to contact page
    window.open(
      "mailto:support@propulse.ai?subject=Inquiry%20about%20ProPulse%20AI",
      "_blank"
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="cta-section py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Content */}
          <div className="cta-content animate-optimized mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Proposal Process?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who are already winning more deals
              and saving hours every week with our AI-powered platform.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                10x Faster
              </h3>
              <p className="text-blue-100">
                Create proposals in minutes, not hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                95% Success Rate
              </h3>
              <p className="text-blue-100">Higher client approval rates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Users className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                10,000+ Users
              </h3>
              <p className="text-blue-100">
                Trusted by professionals worldwide
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 shadow-large hover:shadow-hover text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-10 py-5 bg-transparent text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              Sign In
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-5 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              Contact Us
            </Link>
          </div>

          {/* Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
            <button
              onClick={handleExtensionDownload}
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              <Download className="mr-2 w-5 h-5" />
              Download Extension
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-blue-200 mb-4">No credit card required</p>
            <div className="flex items-center justify-center space-x-6 text-blue-200">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Full access</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {/* Contact Button */}
          <button
            onClick={handleContactClick}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            title="Contact Support"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            title="Scroll to Top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default CTA;
