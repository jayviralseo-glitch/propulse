import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Send,
  CheckCircle,
  ArrowRight,
  Play,
  BookOpen,
  Rocket,
} from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: User,
      title: "Create Your Profile",
      description:
        "Set up your professional profile with your skills, experience, and industry expertise.",
      color: "from-blue-500 to-blue-600",
      details:
        "Build a comprehensive profile that showcases your expertise, past projects, and industry knowledge. Our AI will use this information to create more personalized and compelling proposals.",
      action: "Create Profile",
      actionLink: "/register",
      actionIcon: User,
    },
    {
      icon: FileText,
      title: "Generate Proposal",
      description:
        "Input job requirements and let our AI create a compelling, personalized proposal.",
      color: "from-purple-500 to-purple-600",
      details:
        "Simply describe the project requirements, client needs, and your approach. Our AI will analyze thousands of successful proposals to generate one that matches your style and addresses the client's specific needs.",
      action: "Try Generator",
      actionLink: "/register",
      actionIcon: FileText,
    },
    {
      icon: Send,
      title: "Review & Customize",
      description:
        "Review the generated proposal and make any necessary adjustments to match your style.",
      color: "from-green-500 to-green-600",
      details:
        "Review the AI-generated proposal and customize it to perfectly match your voice, brand, and specific requirements. Add personal touches, modify sections, or restructure as needed.",
      action: "Learn Editing",
      actionLink: "/register",
      actionIcon: Send,
    },
    {
      icon: CheckCircle,
      title: "Send & Win",
      description:
        "Send your professional proposal to clients and increase your chances of winning the deal.",
      color: "from-orange-500 to-orange-600",
      details:
        "Send your polished proposal with confidence. Track delivery, monitor engagement, and follow up strategically. Our analytics help you understand what works and optimize future proposals.",
      action: "View Analytics",
      actionLink: "/register",
      actionIcon: CheckCircle,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes with our simple, intuitive process. From
            profile creation to winning proposals, we've made it effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="step-item animate-optimized relative"
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 z-10">
                  {index + 1}
                </div>

                {/* Step Content */}
                <div className="text-center pt-8">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${
                      step.color
                    } rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium transition-transform duration-300 ${
                      activeStep === index ? "scale-110" : ""
                    }`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Step Details on Hover */}
                  {activeStep === index && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {step.details}
                      </p>
                      <Link
                        to={step.actionLink}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        {step.action}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Arrow (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-4 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-2 h-2 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who are already winning more deals
              with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-medium hover:shadow-hover"
              >
                Get Started
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 shadow-medium hover:shadow-hover"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                View Tutorial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
