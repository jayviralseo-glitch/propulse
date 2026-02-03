import React from "react";
import { Users, UserCheck, UserX, Crown, TrendingUp } from "lucide-react";

const UserStats = ({ stats }) => {
  // If no stats provided, show loading or error state
  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="h-3 sm:h-4 bg-gray-200 rounded-lg w-3/4 mb-2 sm:mb-4 mx-auto sm:mx-0"></div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-1/2 mx-auto sm:mx-0"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
      {/* Total Users */}
      <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
            <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Total Users
            </p>
            <p className="text-base sm:text-2xl font-bold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
            <div className="p-2 bg-green-100 rounded-xl flex-shrink-0">
              <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Active Users
            </p>
            <p className="text-base sm:text-2xl font-bold text-gray-900">
              {stats.activeUsers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              {stats.totalUsers > 0
                ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </div>
        </div>
      </div>

      {/* Admin Users */}
      <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
            <div className="p-2 bg-purple-100 rounded-xl flex-shrink-0">
              <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Admin Users
            </p>
            <p className="text-base sm:text-2xl font-bold text-gray-900">
              {stats.adminUsers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              {stats.totalUsers > 0
                ? ((stats.adminUsers / stats.totalUsers) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </div>
        </div>
      </div>

      {/* New Users This Month */}
      <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
            <div className="p-2 bg-orange-100 rounded-xl flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              New This Month
            </p>
            <p className="text-base sm:text-2xl font-bold text-gray-900">
              {stats.newUsersThisMonth.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString("en-US", { month: "long" })}
            </p>
          </div>
        </div>
      </div>

      {/* Premium Users */}
      <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
            <div className="p-2 bg-yellow-100 rounded-xl flex-shrink-0">
              <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Premium Users
            </p>
            <p className="text-base sm:text-2xl font-bold text-gray-900">
              {stats.premiumUsers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              {stats.totalUsers > 0
                ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
