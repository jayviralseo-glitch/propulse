import React, { useState, useEffect } from "react";
import { X, Save, FileText } from "lucide-react";
import { getAvailableIcons } from "../../../../utils/iconUtils";

const TemplateModal = ({ mode, template, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "FileText",
    prompt: "",
    category: "simple",
    order: 0,
    isActive: true,
  });

  const categories = [
    { value: "cover-letter", label: "Cover Letter" },
    { value: "approach", label: "Approach" },
    { value: "job-application", label: "Job Application" },
    { value: "simple", label: "Simple" },
    { value: "questions", label: "Questions" },
    { value: "estimate", label: "Estimate" },
  ];

  const icons = getAvailableIcons();

  useEffect(() => {
    if (mode === "edit" && template) {
      setFormData({
        name: template.name || "",
        description: template.description || "",
        icon: template.icon || "FileText",
        prompt: template.prompt || "",
        category: template.category || "simple",
        order: template.order || 0,
        isActive: template.isActive !== undefined ? template.isActive : true,
      });
    }
  }, [mode, template]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIconSelect = (icon) => {
    setFormData((prev) => ({ ...prev, icon }));
  };

  const getIconComponent = (iconValue) => {
    const iconOption = icons.find((i) => i.value === iconValue);
    return iconOption ? iconOption.component : FileText;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "create" ? "Create New Template" : "Edit Template"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter template name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter template description"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((iconOption) => {
                const IconComponent = iconOption.component;
                return (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() => handleIconSelect(iconOption.value)}
                    className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${
                      formData.icon === iconOption.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 text-gray-600" />
                    <span className="text-xs text-gray-600 mt-1">
                      {iconOption.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected:{" "}
              {icons.find((i) => i.value === formData.icon)?.label ||
                formData.icon}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Prompt *
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Enter the AI prompt that will generate proposals using this template..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This prompt will be used by the AI to generate proposals
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Template is active and available to users
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create Template"
                : "Update Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;
