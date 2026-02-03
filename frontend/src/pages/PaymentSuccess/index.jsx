import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle, ArrowRight, Clock, Zap } from "lucide-react";
import Header from "../../components/Header";
import api from "../../services/api";
import { useToast } from "../../hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (paymentId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [paymentId]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/payments/verify-payment", {
        paymentId: paymentId,
      });

      if (response.success) {
        setPaymentDetails(response.payment);
        toast({
          title: "Payment Successful!",
          description: "Your subscription has been activated successfully.",
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: response.message || "Unable to verify payment status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment status. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Floating dots */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="space-y-8 animate-fade-in">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-large">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for your subscription! Your account has been upgraded
              and you now have access to all the features.
            </p>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <Card className="card-modern bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white/60 rounded-2xl border border-white/30">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Plan</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {paymentDetails.plan}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white/60 rounded-2xl border border-white/30">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Billing
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {paymentDetails.billingType}
                    </p>
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Amount Paid
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    R {paymentDetails.amount}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {paymentDetails.currency}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="card-modern bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What's Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <p className="text-gray-700">
                    Your subscription is now active and you can start generating
                    proposals
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <p className="text-gray-700">
                    You'll receive a confirmation email with your subscription
                    details
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <p className="text-gray-700">
                    Your subscription will automatically renew monthly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-2xl px-8 py-4 font-semibold"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/profiles")}
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 hover:text-blue-700 rounded-2xl px-8 py-4 font-semibold transition-all duration-300"
            >
              Manage Profiles
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
