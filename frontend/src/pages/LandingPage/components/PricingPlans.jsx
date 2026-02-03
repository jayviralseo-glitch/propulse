import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Star, Zap, Crown } from "lucide-react";
import api from "../../../services/api";

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const response = await api.get("/api/pricing-plans");
      const data = response?.pricingPlans
        ? response
        : response?.data || response;
      setPlans(data.pricingPlans || []);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const getPlanIcon = (planName) => {
    switch ((planName || "").toLowerCase()) {
      case "basic":
        return <Zap className="h-8 w-8 text-blue-600" />;
      case "plus":
        return <Star className="h-8 w-8 text-yellow-600" />;
      case "pro":
        return <Crown className="h-8 w-8 text-purple-600" />;
      default:
        return <Zap className="h-8 w-8 text-blue-600" />;
    }
  };

  const getPlanGradient = (planName) => {
    switch ((planName || "").toLowerCase()) {
      case "basic":
        return "from-blue-500 to-blue-600";
      case "plus":
        return "from-yellow-500 to-orange-600";
      case "pro":
        return "from-purple-500 to-pink-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-80 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your proposal generation needs. All
            plans include our advanced AI technology.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan._id}
              className={`pricing-card animate-optimized relative bg-white rounded-2xl p-8 shadow-medium hover:shadow-hover transform hover:-translate-y-2 transition-all duration-300 border-2 ${
                plan.popular
                  ? "border-yellow-400 ring-2 ring-yellow-400 ring-offset-4 ring-offset-white scale-105"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-bl-lg font-semibold text-sm">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                {/* Icon and Title Row */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3">
                    {getPlanIcon(plan.name)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                    {plan.description}
                  </p>
                </div>

                {/* Price and Proposals Row */}
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      ${plan.monthlyPriceUsd}
                    </div>
                    <div className="text-gray-500 text-sm">per month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {plan.monthlyProposals}
                    </div>
                    <div className="text-gray-500 text-sm">proposals</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-gray-900 mb-3 text-center">
                  Features:
                </h4>
                {Array.isArray(plan.features) &&
                  plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {feature.name}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/register"
                className={`block w-full text-center py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 transform hover:-translate-y-1"
                    : `bg-gradient-to-r ${getPlanGradient(
                        plan.name
                      )} text-white hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1`
                } shadow-medium hover:shadow-hover`}
              >
                {plan.popular ? "Get Started" : "Choose Plan"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
