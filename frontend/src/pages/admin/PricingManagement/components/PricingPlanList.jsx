import React, { useState, useEffect } from "react";
import {
  adminGetPricingPlans,
  adminTogglePricingPlan,
  adminDeletePricingPlan,
} from "../../../../services/api";
import {
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import EditPlanModal from "./EditPlanModal";

const PricingPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const result = await adminGetPricingPlans();
      if (result.success) {
        setPlans(result.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (planId) => {
    try {
      const result = await adminTogglePricingPlan(planId);
      if (result.success) {
        setPlans(
          plans.map((plan) =>
            plan._id === planId ? { ...plan, active: !plan.active } : plan
          )
        );
      }
    } catch (error) {
      console.error("Error toggling plan:", error);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        const result = await adminDeletePricingPlan(planId);
        if (result.success) {
          setPlans(plans.filter((plan) => plan._id !== planId));
        }
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const getStatusBadge = (active) => {
    return active ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-200 border-t-green-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading plans...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Pricing Plans ({plans.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {plan.name?.charAt(0)?.toUpperCase() || "P"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {plan.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {plan.description}
                        </div>
                        {plan.popular && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${plan.monthlyPriceUsd}/month
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {plan.monthlyProposals} proposals
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(plan.active)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-1" />
                      {plan.usage?.activeSubscribers || 0}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(plan._id)}
                        className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${
                          plan.active
                            ? "text-green-600 hover:text-green-800"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                        title={plan.active ? "Deactivate" : "Activate"}
                      >
                        {plan.active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        <div className="px-3 py-2">
          <h3 className="text-lg font-medium text-gray-900">
            Pricing Plans ({plans.length})
          </h3>
        </div>

        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {plan.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {plan.name}
                  </div>
                  {plan.popular && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Popular
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(plan._id)}
                  className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    plan.active
                      ? "text-green-600 hover:text-green-800"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title={plan.active ? "Deactivate" : "Activate"}
                >
                  {plan.active ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowEditModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan._id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Plan Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Price:</span>
                <div className="mt-1 text-gray-900 font-medium">
                  ${plan.monthlyPriceUsd}/month
                </div>
              </div>

              <div>
                <span className="text-gray-500">Proposals:</span>
                <div className="mt-1 text-gray-900 font-medium">
                  {plan.monthlyProposals} proposals
                </div>
              </div>

              <div>
                <span className="text-gray-500">Status:</span>
                <div className="mt-1">{getStatusBadge(plan.active)}</div>
              </div>

              <div>
                <span className="text-gray-500">Subscribers:</span>
                <div className="mt-1 text-gray-900 font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {plan.usage?.activeSubscribers || 0}
                </div>
              </div>
            </div>

            {/* Description */}
            {plan.description && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-500 text-xs">Description:</span>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {showEditModal && selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlan(null);
          }}
          onUpdate={(updatedPlan) => {
            setPlans(
              plans.map((plan) =>
                plan._id === updatedPlan._id ? updatedPlan : plan
              )
            );
            setShowEditModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

export default PricingPlanList;
