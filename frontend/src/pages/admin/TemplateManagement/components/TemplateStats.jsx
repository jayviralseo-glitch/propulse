import React from "react";
import { FileText, CheckCircle, XCircle, Tag } from "lucide-react";

const TemplateStats = ({ stats }) => {
  const { totalTemplates, activeTemplates, inactiveTemplates, categoryCounts } =
    stats;

  const categoryLabels = {
    "cover-letter": "Cover Letter",
    approach: "Approach",
    "job-application": "Job Application",
    simple: "Simple",
    questions: "Questions",
    estimate: "Estimate",
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Template Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Templates
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {totalTemplates}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-green-100 rounded-xl flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {activeTemplates}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-red-100 rounded-xl flex-shrink-0">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Inactive
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {inactiveTemplates}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
              <div className="p-2 bg-purple-100 rounded-xl flex-shrink-0">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Categories
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {Object.keys(categoryCounts).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Category Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div
              key={category}
              className="text-center p-3 bg-gray-50 rounded-xl"
            >
              <p className="text-sm font-medium text-gray-600">
                {categoryLabels[category] || category}
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900">
                {count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateStats;
