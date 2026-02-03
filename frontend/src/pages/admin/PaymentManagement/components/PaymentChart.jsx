import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

const PaymentChart = ({ payments }) => {
  const [period, setPeriod] = useState("30d");

  // Calculate chart data from the passed payments
  const getChartData = () => {
    const now = new Date();
    const periodStart = new Date();

    // Set period start date based on selected period
    switch (period) {
      case "7d":
        periodStart.setDate(now.getDate() - 7);
        break;
      case "30d":
        periodStart.setDate(now.getDate() - 30);
        break;
      case "90d":
        periodStart.setDate(now.getDate() - 90);
        break;
      case "1y":
        periodStart.setFullYear(now.getFullYear() - 1);
        break;
      default:
        periodStart.setDate(now.getDate() - 30);
    }

    // Filter payments for the selected period
    const periodPayments = payments.filter(
      (payment) => new Date(payment.createdAt) >= periodStart
    );

    // Group payments by date and calculate revenue
    const revenueByDay = {};
    periodPayments
      .filter(
        (payment) =>
          payment.status === "completed" || payment.status === "verified"
      )
      .forEach((payment) => {
        const date = new Date(payment.createdAt).toISOString().split("T")[0];
        revenueByDay[date] = (revenueByDay[date] || 0) + (payment.amount || 0);
      });

    // Convert to chart format and convert ZAR to USD
    const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue: revenue / 18.5, // Convert ZAR to USD
    }));

    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = getChartData();
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!chartData) return null;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPeriod("7d")}
            className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
              period === "7d"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod("30d")}
            className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
              period === "30d"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod("90d")}
            className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
              period === "90d"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setPeriod("1y")}
            className={`px-3 py-1 text-sm font-medium rounded-xl transition-colors ${
              period === "1y"
                ? "bg-orange-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
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
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              labelFormatter={(label) => `Date: ${formatDate(label)}`}
              formatter={(value, name) => [
                name === "revenue"
                  ? `$${value.toLocaleString()}`
                  : value.toLocaleString(),
                name === "revenue" ? "Revenue" : "Payments",
              ]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
              name="revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-orange-600 font-medium">
            Completed payments
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">Daily Average</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {chartData.length > 0
              ? `$${(totalRevenue / chartData.length).toFixed(2)}`
              : "$0.00"}
          </p>
          <p className="text-xs text-gray-500">Per active day</p>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentChart;
