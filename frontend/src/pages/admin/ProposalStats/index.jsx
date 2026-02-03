import React from "react";
import { FileText } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import ProposalOverview from "./components/ProposalOverview";
import ProposalChart from "./components/ProposalChart";
import TopUsers from "./components/TopUsers";
import ProposalList from "./components/ProposalList";

const ProposalStats = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="Proposal Analytics"
        description="Monitor proposal generation and user activity"
        icon={FileText}
        showBackButton={true}
        backLink="/admin"
        iconBgColor="from-purple-500 to-purple-600"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Overview Stats */}
        <ProposalOverview />

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
          <ProposalChart />
          <TopUsers />
        </div>

        {/* Proposal List */}
        <div className="mt-8">
          <ProposalList />
        </div>
      </div>
    </div>
  );
};

export default ProposalStats;
