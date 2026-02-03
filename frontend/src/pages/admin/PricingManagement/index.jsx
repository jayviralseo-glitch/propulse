import React from "react";
import { CreditCard, Plus } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import PricingPlanList from "./components/PricingPlanList";
import CreatePlanModal from "./components/CreatePlanModal";

const PricingManagement = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="Pricing Management"
        description="Create and manage subscription plans"
        icon={CreditCard}
        showBackButton={true}
        backLink="/admin"
        iconBgColor="from-green-500 to-green-600"
      />

      {/* Action Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PricingPlanList />
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default PricingManagement;
