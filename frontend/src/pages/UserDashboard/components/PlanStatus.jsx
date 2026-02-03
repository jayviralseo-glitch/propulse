import React from "react";
import { Crown, AlertCircle, Clock, Calendar, FileText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

const PlanStatus = ({ user, onUpgradeClick }) => {
  if (!user) return null;

  // Debug logging
  console.log("PlanStatus - User data received:", user);
  console.log("PlanStatus - Plan fields:", {
    planStatus: user.planStatus,
    currentPlan: user.currentPlan,
    planExpirationDate: user.planExpirationDate,
    billingPeriod: user.billingPeriod,
    availableProposals: user.availableProposals,
  });

  const getStatusColor = (planStatus) => {
    switch (planStatus) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "inactive":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "expired":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (planStatus) => {
    switch (planStatus) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "expired":
        return "Expired";
      default:
        return "No Plan";
    }
  };

  const isFreelancer =
    user.planStatus === "inactive" ||
    user.planStatus === "expired" ||
    !user.planStatus;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Subscription Status
              </h2>
              <p className="text-sm text-gray-500">Plan overview & usage</p>
            </div>
          </div>
          {isFreelancer && (
            <Button
              onClick={onUpgradeClick}
              size="sm"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
            >
              Upgrade
            </Button>
          )}
        </div>

        {/* Main Content - Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Plan Status */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Status
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                <span className="text-sm font-medium text-gray-900">
                  {getStatusText(user.planStatus)}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    user.planStatus
                  )}`}
                >
                  {user.currentPlan ? user.currentPlan : "Free"}
                </span>
              </div>
            </div>
          </div>

          {/* Available Proposals */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Proposals
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.availableProposals || 0}
              </p>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Expires
              </p>
              <p className="text-sm font-medium text-gray-900">
                {user.planExpirationDate
                  ? new Date(user.planExpirationDate).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>

          {/* Billing Period */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Billing
              </p>
              <p className="text-sm font-medium text-gray-900">
                {user.billingPeriod ? user.billingPeriod : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Warning for Freelancers - Compact */}
        {isFreelancer && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-orange-800 font-medium">
                    {user.planStatus === "expired"
                      ? "Subscription expired. Renew to continue."
                      : "Upgrade to unlock unlimited proposals."}
                  </p>
                </div>
              </div>
              <Button
                onClick={onUpgradeClick}
                size="sm"
                variant="outline"
                className="w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-100 text-xs px-3 py-1"
              >
                View Plans
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanStatus;
