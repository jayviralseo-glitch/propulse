import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import { adminGetUser, adminGetUserAnalytics } from "../../../services/api";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchUserAnalytics();
    }
  }, [user, period]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const result = await adminGetUser(id);
      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const result = await adminGetUserAnalytics(id, period);
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
      expired: { color: "bg-gray-100 text-gray-800", icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { color: "bg-blue-100 text-blue-800" },
      plus: { color: "bg-purple-100 text-purple-800" },
      pro: { color: "bg-orange-100 text-orange-800" },
    };

    const config = planConfig[plan?.toLowerCase()] || planConfig.basic;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {plan || "No Plan"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded-lg w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded-lg w-24 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              User Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist.
            </p>
            <Link
              to="/admin/users"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="User Details"
        description={`${user.name} - ${user.email}`}
        icon={User}
        showBackButton={true}
        backLink="/admin/users"
        iconBgColor="from-blue-500 to-blue-600"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">
                      {user.phoneNumber || "No phone"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined</p>
                    <p className="text-gray-900">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Subscription Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Current Plan
                    </p>
                    {getPlanBadge(user.currentPlan)}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    {getStatusBadge(user.planStatus)}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Billing Period
                    </p>
                    <p className="text-gray-900">
                      {user.billingPeriod || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Plan Expires
                    </p>
                    <p className="text-gray-900">
                      {user.planExpirationDate
                        ? formatDate(user.planExpirationDate)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Proposals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Proposals
                </h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="text-sm border border-gray-300 rounded-xl px-3 py-1"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>

              {analytics?.proposals && analytics.proposals.length > 0 ? (
                <div className="space-y-4">
                  {analytics.proposals.map((proposal, index) => (
                    <div
                      key={proposal._id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatDate(proposal.createdAt)}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Job Description
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {proposal.jobDescription}
                          </p>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Generated Proposal
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-4">
                            {proposal.generatedProposal}
                          </p>
                          {proposal.metadata && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>
                                  Tokens:{" "}
                                  {proposal.metadata.tokensUsed || "N/A"}
                                </span>
                                <span>
                                  Time:{" "}
                                  {proposal.metadata.generationTime || "N/A"}ms
                                </span>
                                <span>
                                  Model: {proposal.metadata.model || "N/A"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No proposals found for this period
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                User Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Proposals</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {user.stats?.totalProposals || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Payments</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {user.stats?.totalPayments || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Profiles</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {user.stats?.activeProfiles || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Available Proposals
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {user.availableProposals || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* User Profiles */}
            {user.profiles && user.profiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  User Profiles
                </h3>
                <div className="space-y-3">
                  {user.profiles.map((profile) => (
                    <div
                      key={profile._id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {profile.profileName || "Unnamed Profile"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {profile.profession || "No profession specified"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
