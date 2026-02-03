import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import PaymentOverview from "./components/PaymentOverview";
import PaymentChart from "./components/PaymentChart";
import PaymentList from "./components/PaymentList";
import FailedPayments from "./components/FailedPayments";
import { adminGetPayments } from "../../../services/api";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminGetPayments({ limit: 1000 });

      if (result.success) {
        setPayments(result.data);
      } else {
        setError("Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  const refreshPayments = () => {
    fetchPayments();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={refreshPayments}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="Payment Management"
        description="Monitor payments, revenue, and failed transactions"
        icon={DollarSign}
        showBackButton={true}
        backLink="/admin"
        iconBgColor="from-orange-500 to-orange-600"
      />

      {/* Action Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-end">
          <button
            onClick={refreshPayments}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Overview Stats */}
        <PaymentOverview payments={payments} />

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
          <PaymentChart payments={payments} />
          <FailedPayments payments={payments} />
        </div>

        {/* Payment List */}
        <div className="mt-8">
          <PaymentList payments={payments} refreshPayments={refreshPayments} />
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
