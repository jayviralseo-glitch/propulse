import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Shield, Lock, UserCheck, Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requireBackendUser = false }) => {
  const { currentUser, backendUser, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
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

        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="glass-effect card-modern p-8 text-center max-w-md w-full mx-4">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-medium">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl opacity-20 blur-lg"></div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Loading
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
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

        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="glass-effect card-modern p-8 text-center max-w-md w-full mx-4 animate-fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-medium">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl opacity-20 blur-lg"></div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Please log in to access this page and unlock the full potential of
              ProPulse.
            </p>

            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium shadow-medium hover:shadow-large hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (requireBackendUser && !backendUser) {
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

        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="glass-effect card-modern p-8 text-center max-w-md w-full mx-4 animate-fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-medium">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl opacity-20 blur-lg"></div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Set up your professional profile to start generating amazing
              proposals with ProPulse.
            </p>

            <Button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium shadow-medium hover:shadow-large hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
