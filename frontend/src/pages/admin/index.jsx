import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../components/AdminHeader";
import {
  Users,
  CreditCard,
  FileText,
  DollarSign,
  BarChart3,
  Clock,
} from "lucide-react";
import {
  adminGetUsers,
  adminGetPricingPlans,
  adminGetProposals,
  adminGetPayments,
} from "../../services/api";

const AdminDashboard = () => {
  const { backendUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    totalProposals: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingPayments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (backendUser && backendUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    if (backendUser) {
      setIsLoading(false);
      fetchDashboardStats();
    }
  }, [backendUser, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);

      // Fetch all stats in parallel
      const [usersResult, pricingResult, proposalsResult, paymentsResult] =
        await Promise.all([
          adminGetUsers({ limit: 1000 }),
          adminGetPricingPlans({ limit: 1000 }),
          adminGetProposals({ limit: 1000 }),
          adminGetPayments({ limit: 1000 }),
        ]);

      // Calculate statistics
      const totalUsers = usersResult.success ? usersResult.data.length : 0;

      const activePlans = pricingResult.success
        ? pricingResult.data.filter((plan) => plan.isActive).length
        : 0;

      const totalProposals = proposalsResult.success
        ? proposalsResult.data.length
        : 0;

      const totalRevenue = paymentsResult.success
        ? paymentsResult.data
            .filter(
              (payment) =>
                payment.status === "completed" || payment.status === "verified"
            )
            .reduce((sum, payment) => sum + (payment.amount || 0), 0) / 18.5 // Convert ZAR to USD
        : 0;

      const activeUsers = usersResult.success
        ? usersResult.data.filter((user) => user.planStatus === "active").length
        : 0;

      const pendingPayments = paymentsResult.success
        ? paymentsResult.data.filter((payment) => payment.status === "pending")
            .length
        : 0;

      setStats({
        totalUsers,
        activePlans,
        totalProposals,
        totalRevenue,
        activeUsers,
        pendingPayments,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    if (backendUser && backendUser.role === "admin") {
      const interval = setInterval(fetchDashboardStats, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [backendUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
      </div>
    );
  }

  const adminModules = [
    {
      title: "User Management",
      description: "Manage users, roles, and subscriptions",
      icon: Users,
      link: "/admin/users",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Pricing Plans",
      description: "Create and manage subscription plans",
      icon: CreditCard,
      link: "/admin/pricing",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Template Management",
      description: "Create and manage proposal templates",
      icon: FileText,
      link: "/admin/templates",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Proposal Analytics",
      description: "View proposal statistics and insights",
      icon: BarChart3,
      link: "/admin/proposals",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Payment Management",
      description: "Monitor payments and revenue",
      icon: DollarSign,
      link: "/admin/payments",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="Admin Panel"
        description={`Welcome back, ${backendUser?.name}`}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Manage your application from the admin panel
          </p>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {adminModules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Link key={index} to={module.link} className="group block">
                <div
                  className={`${module.bgColor} rounded-xl p-3 sm:p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center justify-center sm:justify-start">
                      <div
                        className={`${module.iconColor} p-2 sm:p-3 rounded-lg bg-white shadow-sm flex-shrink-0`}
                      >
                        <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="text-sm sm:text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs sm:text-base text-gray-600 mt-1 group-hover:text-gray-500 transition-colors hidden sm:block">
                        {module.description}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hidden sm:flex`}
                    >
                      <span className="text-white text-xs sm:text-sm font-medium">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Quick Stats
            </h3>
            <button
              onClick={fetchDashboardStats}
              disabled={statsLoading}
              className="w-full sm:w-auto px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {statsLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  {statsLoading ? (
                    <div className="animate-pulse h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mx-auto sm:mx-0"></div>
                  ) : (
                    <p className="text-base sm:text-2xl font-bold text-gray-900">
                      {stats.totalUsers.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Proposals
                  </p>
                  {statsLoading ? (
                    <div className="animate-pulse h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mx-auto sm:mx-0"></div>
                  ) : (
                    <p className="text-base sm:text-2xl font-bold text-gray-900">
                      {stats.totalProposals.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Revenue
                  </p>
                  {statsLoading ? (
                    <div className="animate-pulse h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mx-auto sm:mx-0"></div>
                  ) : (
                    <p className="text-base sm:text-2xl font-bold text-gray-900">
                      ${stats.totalRevenue.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Completed payments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                  <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  {statsLoading ? (
                    <div className="animate-pulse h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mx-auto sm:mx-0"></div>
                  ) : (
                    <div>
                      <p className="text-base sm:text-2xl font-bold text-gray-900">
                        {stats.activeUsers.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.totalUsers > 0
                          ? `${(
                              (stats.activeUsers / stats.totalUsers) *
                              100
                            ).toFixed(1)}% of total`
                          : "0% of total"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                  <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </p>
                  {statsLoading ? (
                    <div className="animate-pulse h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mx-auto sm:mx-0"></div>
                  ) : (
                    <div>
                      <p className="text-base sm:text-2xl font-bold text-gray-900">
                        ${stats.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">This month</p>
                      <p className="text-xs text-yellow-600 font-medium">
                        Completed payments only
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Pending Payments
                  </p>
                  {statsLoading ? (
                    <div className="animate-pulse h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mx-auto sm:mx-0"></div>
                  ) : (
                    <p className="text-base sm:text-2xl font-bold text-gray-900">
                      {stats.pendingPayments.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
