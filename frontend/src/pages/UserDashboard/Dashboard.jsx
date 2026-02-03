import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import {
  Plus,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Download,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Header from "../../components/Header";
import ExtensionInstall from "./ExtensionInstall";
import ProposalChart from "../../components/ProposalChart";
import PlanStatus from "./components/PlanStatus";

export default function Dashboard() {
  const { currentUser, backendUser } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalProposals: 0,
    thisWeekProposals: 0,
    activeProfiles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const data = await api.get("/api/history/dashboard-stats");
        if (data.success) {
          setDashboardStats(data.stats);
        } else {
          setError("Failed to fetch dashboard stats");
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    if (backendUser) {
      fetchDashboardStats();
    }
  }, [backendUser]);

  const handleGenerateProposal = () => {
    // TODO: Implement proposal generation logic
    console.log("Generate proposal clicked");
  };

  const handleUpgradeClick = () => {
    // Redirect to pricing page
    window.location.href = "/pricing";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 mb-2">Failed to load dashboard</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
            </div>
          </div>
        </main>
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

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Top Section: Extension Install and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Extension Installation - Left Side */}
            <ExtensionInstall />

            {/* Proposal Analytics Chart - Right Side */}
            <ProposalChart />
          </div>

          {/* Plan Status Section */}
          <PlanStatus user={backendUser} onUpgradeClick={handleUpgradeClick} />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm border border-white/20">
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-medium">
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl opacity-20 blur-lg sm:blur-xl"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-4 text-lg sm:text-xl">
                  Create Profile
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base">
                  Set up your professional profile with skills and experience
                </p>
                <Link to="/profiles/new">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-green-50/60 backdrop-blur-sm border border-white/20">
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-medium">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl sm:rounded-3xl opacity-20 blur-lg sm:blur-xl"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-4 text-lg sm:text-xl">
                  Generate Proposal
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base">
                  Use the browser extension to create AI-powered proposals
                </p>
                <Button
                  onClick={handleGenerateProposal}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base"
                >
                  Learn How
                </Button>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-sm border border-white/20 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-green-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-medium">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-purple-500 to-green-600 rounded-2xl sm:rounded-3xl opacity-20 blur-lg sm:blur-xl"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 sm:mb-4 text-lg sm:text-xl">
                  View History
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base">
                  Track your proposal performance and success rates
                </p>
                <Link to="/history">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-green-600 hover:from-purple-600 hover:to-green-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          {backendUser && (
            <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm border border-white/20">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Profile Summary
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link to="/profiles">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-2 border-blue-200 text-blue-700 hover:bg-white hover:border-blue-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 text-sm sm:text-base"
                      >
                        View All Profiles
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-2 border-green-200 text-green-700 hover:bg-white hover:border-green-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 text-sm sm:text-base"
                      >
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/60 rounded-xl sm:rounded-2xl border border-white/30 backdrop-blur-sm">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-medium">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      Active Profiles
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {dashboardStats.activeProfiles}
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/60 rounded-xl sm:rounded-2xl border border-white/30 backdrop-blur-sm">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-medium">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      Proposals Created
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                      {dashboardStats.totalProposals}
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/60 rounded-xl sm:rounded-2xl border border-white/30 backdrop-blur-sm col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-medium">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      This Week
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                      {dashboardStats.thisWeekProposals}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
