import React, { useState, useEffect } from "react";
import { FileText, Users, TrendingUp, Clock } from "lucide-react";
import { adminGetProposalStats } from "../../../../services/api";

const ProposalOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await adminGetProposalStats(period);
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching proposal stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (period) => {
    const labels = {
      "7d": "Last 7 Days",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
      "1y": "Last Year",
    };
    return labels[period] || period;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      {/* Period Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <div className="flex space-x-2">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
                period === p
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Total Proposals */}
        <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-purple-100 rounded-xl flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Proposals
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {stats.totalProposals.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{getPeriodLabel(period)}</p>
            </div>
          </div>
        </div>

        {/* All Time Proposals */}
        <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                All Time
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {stats.totalProposalsAllTime.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total proposals</p>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-green-100 rounded-xl flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active Users
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {stats.activeUsers.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{getPeriodLabel(period)}</p>
            </div>
          </div>
        </div>

        {/* Average Per User */}
        <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-orange-100 rounded-xl flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Avg Per User
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {parseFloat(stats.avgProposalsPerUser).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">{getPeriodLabel(period)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
            User Activity
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.activeUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Activity Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalUsers > 0
                  ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
            Proposal Metrics
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Period Proposals</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalProposals.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">All Time</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalProposalsAllTime.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Growth</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalProposalsAllTime > 0
                  ? (
                      (stats.totalProposals / stats.totalProposalsAllTime) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalOverview;
