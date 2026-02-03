import React from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const PaymentOverview = ({ payments }) => {
  // Calculate stats from the passed payments data
  const totalRevenue = payments
    .filter(
      (payment) =>
        payment.status === "completed" || payment.status === "verified"
    )
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const totalPayments = payments.length;
  const completedPayments = payments.filter(
    (payment) => payment.status === "completed" || payment.status === "verified"
  ).length;
  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending"
  ).length;
  const failedPayments = payments.filter(
    (payment) => payment.status === "failed"
  ).length;

  const averagePayment =
    completedPayments > 0 ? totalRevenue / completedPayments : 0;

  // Convert ZAR to USD (1 USD ≈ 18.5 ZAR)
  const totalRevenueUSD = totalRevenue / 18.5;
  const averagePaymentUSD = averagePayment / 18.5;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenueUSD.toFixed(2)}`,
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      note: "Completed payments only",
    },
    {
      title: "Total Payments",
      value: totalPayments,
      change: "+8.2%",
      changeType: "positive",
      icon: CreditCard,
    },
    {
      title: "Success Rate",
      value: `${
        totalPayments > 0
          ? ((completedPayments / totalPayments) * 100).toFixed(1)
          : 0
      }%`,
      change: "+2.1%",
      changeType: "positive",
      icon: TrendingUp,
    },
    {
      title: "Average Payment",
      value: `$${averagePaymentUSD.toFixed(2)}`,
      change: "+5.3%",
      changeType: "positive",
      icon: AlertTriangle,
      note: "Per successful payment",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Payment Overview
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex-shrink-0">
                  <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
              <div className="min-w-0 flex-1 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-base sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {stat.note && (
                  <p className="text-xs text-gray-500">{stat.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOverview;
