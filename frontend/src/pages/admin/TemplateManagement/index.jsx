import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { FileText } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import { adminGetTemplates } from "../../../services/api";
import TemplateStats from "./components/TemplateStats";
import TemplateList from "./components/TemplateList";

const TemplateManagement = () => {
  const { backendUser } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const result = await adminGetTemplates({ limit: 1000 });
      if (result.success) {
        setTemplates(result.templates || []);
      } else {
        setError(result.error || "Failed to fetch templates");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter((t) => t.isActive).length;
    const inactiveTemplates = totalTemplates - activeTemplates;

    const categoryCounts = templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalTemplates,
      activeTemplates,
      inactiveTemplates,
      categoryCounts,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
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
            onClick={fetchTemplates}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="Template Management"
        description="Create and manage proposal templates for users"
        icon={FileText}
        showBackButton={true}
        backLink="/admin"
        iconBgColor="from-purple-500 to-purple-600"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateStats stats={stats} />
        <TemplateList
          templates={templates}
          onTemplatesUpdate={(updatedTemplates) =>
            setTemplates(updatedTemplates)
          }
        />
      </div>
    </div>
  );
};

export default TemplateManagement;
