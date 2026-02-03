import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  FileText,
  Clock,
  Shield,
  Users,
  BarChart3,
  Zap,
  Target,
  ArrowRight,
  Info,
} from "lucide-react";

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description:
        "Advanced AI algorithms create compelling, personalized proposals based on your input and industry best practices.",
      color: "from-blue-500 to-purple-600",
      details:
        "Our AI analyzes thousands of successful proposals to understand what works best in your industry. It considers client requirements, your expertise, and market trends to generate proposals that convert.",
      action: "Try AI Generation",
      actionLink: "/register",
    },
    {
      icon: FileText,
      title: "Professional Templates",
      description:
        "Access to a library of industry-specific templates that ensure your proposals look polished and professional.",
      color: "from-green-500 to-emerald-600",
      details:
        "Choose from 50+ industry-specific templates designed by proposal experts. Each template follows best practices and can be fully customized to match your brand and style.",
      action: "Browse Templates",
      actionLink: "/register",
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description:
        "Generate complete proposals in minutes, not hours. Focus on what matters most - closing deals.",
      color: "from-yellow-500 to-orange-600",
      details:
        "What used to take 4-6 hours now takes just 15-30 minutes. Our AI handles the heavy lifting while you focus on strategy and client relationships.",
      action: "See Speed Demo",
      actionLink: "/register",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security. Your proposals and client information stay confidential.",
      color: "from-red-500 to-pink-600",
      details:
        "Bank-level encryption, SOC 2 compliance, and regular security audits ensure your data is always protected. We never share your information with third parties.",
      action: "Learn Security",
      actionLink: "/register",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work together with your team to create, review, and refine proposals before sending to clients.",
      color: "from-indigo-500 to-purple-600",
      details:
        "Invite team members, assign roles, track changes, and get approval workflows. Collaborate seamlessly whether you're in the same office or across the globe.",
      action: "Team Setup",
      actionLink: "/register",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track proposal success rates, client responses, and optimize your approach with detailed insights.",
      color: "from-teal-500 to-cyan-600",
      details:
        "Get detailed analytics on open rates, response times, win rates, and more. Use data-driven insights to continuously improve your proposal strategy.",
      action: "View Analytics",
      actionLink: "/register",
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and streamline your proposal workflow for maximum efficiency.",
      color: "from-purple-500 to-pink-600",
      details:
        "Set up automated follow-ups, schedule proposals, and create recurring templates. Let automation handle the routine while you focus on high-value activities.",
      action: "Setup Automation",
      actionLink: "/register",
    },
    {
      icon: Target,
      title: "Client-Focused",
      description:
        "Every proposal is tailored to your client's specific needs and pain points for higher success rates.",
      color: "from-orange-500 to-red-600",
      details:
        "Our AI analyzes client requirements and industry context to create proposals that directly address their challenges and demonstrate clear value propositions.",
      action: "Client Strategy",
      actionLink: "/register",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
            Everything You Need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Win More Deals
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you
            need to create winning proposals that convert prospects into paying
            clients.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card animate-optimized group bg-white rounded-2xl p-6 shadow-medium hover:shadow-hover transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Hover Details */}
              {hoveredFeature === index && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Info className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Learn More
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {feature.details}
                  </p>
                  <Link
                    to={feature.actionLink}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {feature.action}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform your proposal process?
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-medium hover:shadow-hover"
          >
            Start Creating Winning Proposals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
