import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  DollarSign,
} from "lucide-react";

const FailedPayments = ({ payments }) => {
  // Filter failed payments from the passed data
  const failedPayments = payments.filter(
    (payment) =>
      payment.status === "failed" ||
      payment.status === "cancelled" ||
      (payment.status === "pending" &&
        new Date(payment.createdAt) <
          new Date(Date.now() - 24 * 60 * 60 * 1000)) // Pending for more than 24 hours
  );

  const getFailureReason = (payment) => {
    switch (payment.status) {
      case "failed":
        return "Payment processing failed";
      case "cancelled":
        return "Payment was cancelled";
      case "pending":
        return "Payment pending for too long";
      default:
        return "Unknown issue";
    }
  };

  const getActionRequired = (payment) => {
    switch (payment.status) {
      case "failed":
        return "Review and retry";
      case "cancelled":
        return "Contact customer";
      case "pending":
        return "Investigate delay";
      default:
        return "Manual review";
    }
  };

  const handleRetryPayment = async (paymentId) => {
    // This would call the retry API
    console.log("Retrying payment:", paymentId);
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

  if (failedPayments.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Failed Payments
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              {failedPayments.length}
            </span>
          </div>
        </div>
        <div className="text-center py-6 sm:py-8">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No failed payments to review</p>
          <p className="text-sm text-gray-400 mt-1">
            All payments are processing successfully
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            Failed Payments
          </h3>
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            {failedPayments.length}
          </span>
        </div>

        <button
          onClick={() => {}} // No refresh button as data is passed as prop
          className="text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {failedPayments.map((payment) => (
          <div
            key={payment._id}
            className="border border-red-200 rounded-xl p-3 sm:p-4 bg-red-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {payment.userId?.name || "Unknown User"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {payment.userId?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <span className="ml-2 text-gray-900">
                      ${((payment.amount || 0) / 18.5).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Plan:</span>
                    <span className="ml-2 text-gray-900">
                      {payment.planId?.name || "Unknown Plan"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Failed:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reason:</span>
                    <span className="ml-2 text-red-600 font-medium">
                      {getFailureReason(payment)}
                    </span>
                  </div>
                </div>

                {payment.paymentMethod && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-red-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Payment Method:
                    </p>
                    <p className="text-xs text-red-700 font-mono">
                      {payment.paymentMethod}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2 ml-4">
                <button
                  onClick={() => handleRetryPayment(payment._id)}
                  disabled={false} // No retrying state as it's not fetched
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {/* No retrying state as it's not fetched */}
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>

                <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {failedPayments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Failed</p>
              <p className="text-base sm:text-lg font-semibold text-red-600">
                {failedPayments.length}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                $
                {failedPayments
                  .reduce((sum, payment) => sum + (payment.amount || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">
                Action Required
              </p>
              <p className="text-base sm:text-lg font-semibold text-orange-600">
                {failedPayments.length}
              </p>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Failed payments require immediate attention to prevent revenue
              loss
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FailedPayments;
