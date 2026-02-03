import React, { useState, useEffect } from "react";
import { Users, Trophy, TrendingUp } from "lucide-react";
import { adminGetProposalStats } from "../../../../services/api";

const TopUsers = () => {
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
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded-lg w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !stats.topUsers) return null;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Top Users</h3>
        </div>

        <div className="flex space-x-2">
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 text-xs font-medium rounded-xl transition-colors ${
                period === p
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {stats.topUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No user data available for this period
            </p>
          </div>
        ) : (
          stats.topUsers.map((user, index) => (
            <div
              key={user.userId}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-medium">
                  {index + 1}
                </div>

                <div className="flex items-center space-x-2">
                  {index === 0 && (
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  )}
                  {index === 1 && <Trophy className="w-4 h-4 text-gray-400" />}
                  {index === 2 && (
                    <Trophy className="w-4 h-4 text-orange-500" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.userName || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.userEmail || "No email"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {user.proposalCount}
                </span>
                <span className="text-xs text-gray-500">proposals</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {stats.activeUsers.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Avg Per User</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {parseFloat(stats.avgProposalsPerUser).toFixed(1)}
            </p>
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {getPeriodLabel(period)} • Showing top 10 users
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopUsers;
