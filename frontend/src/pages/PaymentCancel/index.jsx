import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Header from "../../components/Header";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentId = searchParams.get("payment_id");
  const returnTo = searchParams.get("return_to") || "/pricing";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-red-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Floating dots */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-red-400/30 rounded-full animate-bounce"></div>
        <div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-orange-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-yellow-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="space-y-8 animate-fade-in">
          {/* Cancel Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-large">
              <XCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your payment was cancelled. No charges have been made to your
              account. You can try again anytime.
            </p>
          </div>

          {/* Payment Info */}
          {paymentId && (
            <Card className="card-modern bg-gradient-to-br from-white to-red-50/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Reference
                </h3>
                <p className="text-gray-600 font-mono bg-gray-100 px-4 py-2 rounded-lg inline-block">
                  {paymentId}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Keep this reference number if you need to contact support
                </p>
              </CardContent>
            </Card>
          )}

          {/* What Happened */}
          <Card className="card-modern bg-gradient-to-br from-white to-orange-50/30">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What Happened?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <p className="text-gray-700">
                    You cancelled the payment process before completion
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">2</span>
                  </div>
                  <p className="text-gray-700">
                    No money has been deducted from your account
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">3</span>
                  </div>
                  <p className="text-gray-700">
                    Your subscription remains unchanged
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="card-modern bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What Would You Like to Do?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <p className="text-gray-700">
                    Try the payment again with the same or different plan
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <p className="text-gray-700">
                    Return to your dashboard to continue using the platform
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <p className="text-gray-700">
                    Contact support if you experienced any issues
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-2xl px-8 py-4 font-semibold"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 hover:text-blue-700 rounded-2xl px-8 py-4 font-semibold transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center">
            <p className="text-gray-600">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@propulse.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@propulse.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentCancel;
