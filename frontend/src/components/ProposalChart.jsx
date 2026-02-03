import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "./ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import { getAnalytics } from "../services/api";

const ProposalChart = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period] = useState("7d"); // Always 7 days since backend only supports this

  useEffect(() => {
    fetchAnalytics();
  }, []); // Remove period dependency since it's always 7d

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const result = await getAnalytics(period);
      if (result.success) {
        setAnalyticsData(result.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPeriodLabel = () => {
    return "Last 7 Days"; // Always show 7 days since that's what backend provides
  };

  if (loading) {
    return (
      <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-sm border border-white/20">
        <CardContent className="p-3 sm:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-sm border border-white/20">
        <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  const { dailyData, summary } = analyticsData;

  return (
    <Card className="card-modern hover-lift bg-gradient-to-br from-white/80 to-purple-50/60 backdrop-blur-sm border border-white/20">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-600 rounded-xl flex items-center justify-center shadow-medium">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Proposal Activity
              </h2>
              <p className="text-sm text-gray-600">{getPeriodLabel()}</p>
            </div>
          </div>

          {/* Removed Period Selector - backend only supports 7 days */}
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyData}
              margin={{ top: 5, right: 8, left: 8, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(156, 163, 175, 0.2)"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={{ stroke: "rgba(156, 163, 175, 0.3)" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={{ stroke: "rgba(156, 163, 175, 0.3)" }}
                tickLine={false}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="url(#purpleGradient)"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6", strokeWidth: 1, r: 3 }}
                activeDot={{ r: 4, stroke: "#8B5CF6", strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={1} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full border border-white/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-green-600 rounded-full"></div>
            <span className="text-xs text-gray-700 font-medium">
              Proposals Created
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalChart;
