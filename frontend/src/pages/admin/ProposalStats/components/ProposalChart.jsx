import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { adminGetProposalStats } from "../../../../services/api";
import { BarChart3, TrendingUp } from "lucide-react";

const ProposalChart = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [chartType, setChartType] = useState("line");

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

  const formatChartData = (data) => {
    if (!data || !data.proposalsByDay) return [];

    return data.proposalsByDay.map((item) => ({
      date: item._id,
      proposals: item.count,
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = formatChartData(stats);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Proposal Trends</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
              chartType === "line"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
              chartType === "area"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Area
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                formatter={(value) => [value.toLocaleString(), "Proposals"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="proposals"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                formatter={(value) => [value.toLocaleString(), "Proposals"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="proposals"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#proposalGradient)"
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient
                  id="proposalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">Total in Period</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {stats.totalProposals.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">Daily Average</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {chartData.length > 0
              ? (stats.totalProposals / chartData.length).toFixed(1)
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalChart;
