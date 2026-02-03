import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText, Tag, Hash } from "lucide-react";
import { adminGetTemplate, adminUpdateTemplate } from "../../../services/api";
import { getAvailableIcons } from "../../../utils/iconUtils";

const TemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState(null);
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
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const result = await adminGetTemplate(id);
      if (result.success) {
        setTemplate(result.template);
        setFormData({
          name: result.template.name || "",
          description: result.template.description || "",
          icon: result.template.icon || "FileText",
          prompt: result.template.prompt || "",
          category: result.template.category || "simple",
          order: result.template.order || 0,
          isActive:
            result.template.isActive !== undefined
              ? result.template.isActive
              : true,
        });
      } else {
        setError(result.error || "Failed to fetch template");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await adminUpdateTemplate(id, formData);
      if (result.success) {
        navigate("/admin/templates");
      } else {
        setError(result.error || "Failed to update template");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIconSelect = (iconValue) => {
    setFormData((prev) => ({ ...prev, icon: iconValue }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/templates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <button
              onClick={() => navigate("/admin/templates")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Edit Template
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Update template: {template?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
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
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template description"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {icons.map((iconOption) => {
                  const IconComponent = iconOption.component;
                  return (
                    <button
                      key={iconOption.value}
                      type="button"
                      onClick={() => handleIconSelect(iconOption.value)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-colors text-center ${
                        formData.icon === iconOption.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="mb-1">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mx-auto" />
                      </div>
                      <div className="text-xs text-gray-600">
                        {iconOption.label}
                      </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
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
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
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
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/templates")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Update Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateEdit;
