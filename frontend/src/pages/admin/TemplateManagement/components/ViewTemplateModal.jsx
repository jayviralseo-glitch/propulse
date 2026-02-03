import React from "react";
import { X, FileText, Tag, Hash, CheckCircle, XCircle } from "lucide-react";
import { getIconComponent } from "../../../../utils/iconUtils";

const ViewTemplateModal = ({ template, onClose }) => {
  const categoryLabels = {
    "cover-letter": "Cover Letter",
    approach: "Approach",
    "job-application": "Job Application",
    simple: "Simple",
    questions: "Questions",
    estimate: "Estimate",
  };

  const IconComponent = getIconComponent(template.icon);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Template Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Template Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{template.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {template.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Icon
                  </label>
                  <div className="mt-1">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Properties
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Category
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {categoryLabels[template.category]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Display Order
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {template.order}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {template.isActive ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        template.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(template.createdAt).toLocaleDateString()} at{" "}
                    {new Date(template.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(template.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(template.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Prompt */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              AI Prompt
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                {template.prompt}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This prompt is used by the AI to generate proposals using this
              template.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTemplateModal;
