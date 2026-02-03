// src/pages/Pricing/index.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Check, Star, Zap, Crown, CheckCircle } from "lucide-react";
import Header from "../../components/Header";
import api from "../../services/api";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { toast } = useToast();
  const { backendUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Make sure your api.get returns .data directly; if not, change to: const { data } = await api.get(...)
        const resp = await api.get("/api/pricing-plans");
        const data = resp?.pricingPlans ? resp : resp?.data || resp;
        setPricingPlans(data.pricingPlans || []);
      } catch (err) {
        console.error("Error fetching pricing plans:", err);
        toast({
          title: "Error",
          description: "Failed to load pricing plans",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // ---- helpers -------------------------------------------------------------

  const submitHiddenForm = (actionUrl, fields) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = actionUrl;
    form.style.display = "none";
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  // Handles both JSON and HTML server responses
  const handleCreatePaymentResponse = (raw, contentType) => {
    // If backend returned HTML (auto-submit form)
    if (
      typeof raw === "string" ||
      (contentType && contentType.includes("text/html"))
    ) {
      const html = typeof raw === "string" ? raw : "";
      const w = window.open("", "_self"); // use "_blank" to open in new tab
      if (!w)
        throw new Error("Popup blocked. Please allow popups and try again.");
      w.document.open();
      w.document.write(html);
      w.document.close();
      return;
    }

    // Otherwise expect JSON: { success, payfast: { postUrl, fields } }
    const response = raw?.data ?? raw; // support api wrappers that return .data
    if (
      response?.success &&
      response?.payfast?.postUrl &&
      response?.payfast?.fields
    ) {
      submitHiddenForm(response.payfast.postUrl, response.payfast.fields);
      return;
    }

    // Some wrappers already unwrap to the JSON payload
    if (response?.success && response?.payfast) {
      submitHiddenForm(response.payfast.postUrl, response.payfast.fields);
      return;
    }

    throw new Error(response?.message || "Failed to create payment");
  };

  // ---- actions -------------------------------------------------------------

  const handleSubscribe = async (plan) => {
    try {
      setSelectedPlanId(plan._id);

      const response = await api.post("/api/payments/create-payment", {
        planId: plan._id,
        billingType: "monthly",
      });

      // Handle the response
      handleCreatePaymentResponse(response, "application/json");
    } catch (error) {
      console.error("Error subscribing:", error);

      // Check if this is an HTML response in error
      if (error?.response?.data && typeof error.response.data === "string") {
        handleCreatePaymentResponse(
          error.response.data,
          error.response.headers["content-type"]
        );
        return;
      }

      toast({
        title: "Error",
        description: error?.message || "Failed to process subscription",
        variant: "destructive",
      });
      setSelectedPlanId(null);
    }
  };

  // ---- UI helpers ----------------------------------------------------------

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

  // ---- render --------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
        <Header />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading pricing plans...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" />
        <div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="space-y-8 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your proposal generation needs. All
              plans include our advanced AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => {
              const isLoading = selectedPlanId === plan._id;
              return (
                <Card
                  key={plan._id}
                  className={`card-modern hover-lift relative overflow-hidden ${
                    plan.popular
                      ? "ring-2 ring-yellow-400 ring-offset-4 ring-offset-white"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-bl-lg font-semibold text-sm">
                      Most Popular
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    {/* Icon and Title Row */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3">
                        {getPlanIcon(plan.name)}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </CardTitle>
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
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Features:
                      </h4>
                      {Array.isArray(plan.features) &&
                        plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
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

                    <Button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full bg-gradient-to-r ${getPlanGradient(
                        plan.name
                      )} hover:from-blue-600 hover:to-purple-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-2xl py-3 px-6 font-semibold ${
                        plan.popular ? "scale-105" : ""
                      } ${
                        backendUser?.currentPlan &&
                        backendUser?.planStatus === "active" &&
                        plan.name.toLowerCase() ===
                          backendUser.currentPlan.toLowerCase()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        isLoading ||
                        (backendUser?.currentPlan &&
                          backendUser?.planStatus === "active" &&
                          plan.name.toLowerCase() ===
                            backendUser.currentPlan.toLowerCase())
                      }
                    >
                      {isLoading
                        ? "Processing..."
                        : backendUser?.currentPlan &&
                          backendUser?.planStatus === "active" &&
                          plan.name.toLowerCase() ===
                            backendUser.currentPlan.toLowerCase()
                        ? "Current Plan"
                        : "Subscribe Now"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
