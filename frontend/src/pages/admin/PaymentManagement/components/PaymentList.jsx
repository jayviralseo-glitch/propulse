import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DollarSign,
  Search,
  Filter,
  Eye,
  RefreshCw,
  User,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PaymentList = ({ payments, refreshPayments }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [expandedFields, setExpandedFields] = useState({});

  // Filter options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const planOptions = [
    { value: "all", label: "All Plans" },
    { value: "Basic", label: "Basic" },
    { value: "Plus", label: "Plus" },
    { value: "Pro", label: "Pro" },
  ];

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, planFilter]);

  // Calculate total pages based on filtered payments
  useEffect(() => {
    const filtered = getFilteredPayments();
    const totalPages = Math.ceil(filtered.length / 20);
    setTotalPages(totalPages);
  }, [payments, searchTerm, statusFilter, planFilter]);

  // Get filtered payments
  const getFilteredPayments = () => {
    return payments.filter((payment) => {
      const matchesSearch =
        searchTerm === "" ||
        payment.userId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.userId?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && payment.status === "completed") ||
        (statusFilter === "verified" && payment.status === "verified") ||
        (statusFilter === "pending" && payment.status === "pending") ||
        (statusFilter === "failed" && payment.status === "failed") ||
        (statusFilter === "cancelled" && payment.status === "cancelled");

      const matchesPlan =
        planFilter === "all" || payment.planId?.name === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  };

  const filteredPayments = getFilteredPayments();

  // Toggle field expansion
  const toggleFieldExpansion = (fieldName) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Format long text with see more/see less
  const formatLongText = (text, fieldName, maxLength = 30) => {
    if (!text || text.length <= maxLength) {
      return text;
    }

    const isExpanded = expandedFields[fieldName];
    const displayText = isExpanded
      ? text
      : text.substring(0, maxLength) + "...";

    return (
      <div className="flex flex-col space-y-1">
        <span className="font-mono break-all">{displayText}</span>
        <button
          onClick={() => toggleFieldExpansion(fieldName)}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center space-x-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>See less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>See more</span>
            </>
          )}
        </button>
      </div>
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      failed: { color: "bg-red-100 text-red-800", text: "Failed" },
      cancelled: { color: "bg-gray-100 text-gray-800", text: "Cancelled" },
      refunded: { color: "bg-blue-100 text-blue-800", text: "Refunded" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
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

  const formatAmount = (amount) => {
    // Convert ZAR to USD (1 USD ≈ 18.5 ZAR)
    const amountUSD = parseFloat(amount || 0) / 18.5;
    return `$${amountUSD.toFixed(2)}`;
  };

  // Pagination
  const itemsPerPage = 20; // Default items per page
  const filteredTotalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            Payment Transactions
          </h3>
        </div>
        <div className="p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {planOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            Payment Transactions ({filteredPayments.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.userId?.name || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.userId?.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.planId?.name || "Unknown Plan"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.billingType || "Subscription"}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatAmount(payment.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.currency || "ZAR"}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>

                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(payment.createdAt)}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                          setExpandedFields({}); // Reset expanded fields
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {payment.status === "failed" && (
                        <button
                          className="text-orange-600 hover:text-orange-800 p-1 rounded-lg hover:bg-orange-50 transition-colors"
                          title="Retry Payment"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredTotalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: filteredTotalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-xl ${
                    currentPage === page
                      ? "bg-orange-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage(Math.min(filteredTotalPages, currentPage + 1))
              }
              disabled={currentPage === filteredTotalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Payment Detail Modal */}
      {showPaymentModal &&
        selectedPayment &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
            }}
          >
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-gray-600 bg-opacity-50"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            ></div>

            {/* Modal container */}
            <div
              className="absolute inset-0 flex items-center justify-center p-4"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <div
                className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "42rem",
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Payment Details
                    </h3>
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setExpandedFields({});
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">
                        User Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Name:
                          </span>{" "}
                          {selectedPayment.userId?.name || "Unknown"}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Email:
                          </span>{" "}
                          {selectedPayment.userId?.email || "No email"}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Phone:
                          </span>{" "}
                          {selectedPayment.userId?.phoneNumber || "No phone"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">
                        Payment Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Amount:
                          </span>{" "}
                          {formatAmount(selectedPayment.amount)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Status:
                          </span>{" "}
                          {getStatusBadge(selectedPayment.status)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Plan:
                          </span>{" "}
                          {selectedPayment.planId?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Transaction Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Payment ID:
                          </span>
                          <div className="mt-1">
                            {formatLongText(
                              selectedPayment.paymentId,
                              "paymentId",
                              40
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            PayFast ID:
                          </span>
                          <div className="mt-1">
                            {formatLongText(
                              selectedPayment.pfPaymentId,
                              "pfPaymentId",
                              40
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">
                              Payment Method:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {selectedPayment.paymentMethod || "Credit Card"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Billing Type:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {selectedPayment.billingType || "Monthly"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Verification Status:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {selectedPayment.verificationStatus || "Pending"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Is Subscription:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {selectedPayment.isSubscription ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">
                              Created:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {formatDate(selectedPayment.createdAt)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Updated:
                            </span>
                            <p className="text-gray-900 mt-1">
                              {formatDate(selectedPayment.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PayFast Data Section */}
                  {selectedPayment.payfastData &&
                    Object.keys(selectedPayment.payfastData).length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                          PayFast Data
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="space-y-3 text-sm">
                            {Object.entries(selectedPayment.payfastData).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-gray-700">
                                    {key
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                    :
                                  </span>
                                  <div className="mt-1">
                                    {formatLongText(
                                      typeof value === "object"
                                        ? JSON.stringify(value, null, 2)
                                        : String(value),
                                      `payfast_${key}`,
                                      50
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setExpandedFields({});
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PaymentList;
