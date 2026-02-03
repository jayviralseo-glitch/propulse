import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import BasicInformation from "./BasicInformation";
import SkillsSection from "./SkillsSection";
import EmploymentHistory from "./EmploymentHistory";
import ProjectsSection from "./ProjectsSection";
import CertificationsSection from "./CertificationsSection";
import Header from "../../../components/Header";

// Simple Section Header Component
const SectionHeader = ({ title, icon, iconBgClass }) => {
  return (
    <div className="mb-2 sm:mb-3 lg:mb-4">
      <div className="bg-white/60 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/30 backdrop-blur-sm">
        <div className="flex items-center p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${iconBgClass} rounded-md sm:rounded-lg flex items-center justify-center shadow-medium`}
            >
              <span className="text-white text-xs font-bold">{icon}</span>
            </div>
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900">
              {title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfileCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, backendUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    profileName: "",
    firstName: "",
    lastName: "",
    profession: "",
    description: "",
    skills: [],
    employmentHistory: [],
    projects: [],
    certifications: [],
  });

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addArrayItem = (field, value) => {
    if (field === "skills") {
      // For skills, add the skill string directly
      setProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), value],
      }));
    } else {
      // For other fields, use the default value object
      setProfile((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), getDefaultValue(field)],
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  const addEmployment = () => {
    addArrayItem("employmentHistory");
  };

  const removeEmployment = (index) => {
    removeArrayItem("employmentHistory", index);
  };

  const addProject = () => {
    addArrayItem("projects");
  };

  const removeProject = (index) => {
    removeArrayItem("projects", index);
  };

  const addProjectSkill = (projectIndex, skill) => {
    if (skill.trim()) {
      setProfile((prev) => ({
        ...prev,
        projects: prev.projects.map((project, i) =>
          i === projectIndex
            ? { ...project, skills: [...(project.skills || []), skill.trim()] }
            : project
        ),
      }));
    }
  };

  const removeProjectSkill = (projectIndex, skillIndex) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              skills: project.skills.filter((_, si) => si !== skillIndex),
            }
          : project
      ),
    }));
  };

  const addCertificationSkill = (certIndex, skill) => {
    if (skill.trim()) {
      setProfile((prev) => ({
        ...prev,
        certifications: prev.certifications.map((cert, i) =>
          i === certIndex
            ? { ...cert, skills: [...(cert.skills || []), skill.trim()] }
            : cert
        ),
      }));
    }
  };

  const removeCertificationSkill = (certIndex, skillIndex) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === certIndex
          ? {
              ...cert,
              skills: cert.skills.filter((_, j) => j !== skillIndex),
            }
          : cert
      ),
    }));
  };

  const getDefaultValue = (field) => {
    const defaults = {
      employmentHistory: {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false,
      },
      projects: {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        skills: [],
        isCurrent: false,
      },
      certifications: {
        name: "",
        issuer: "",
        issueDate: "",
        verification: "pending",
        skills: [],
      },
    };
    return defaults[field] || {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = await api.post("/api/profiles", profile);

      toast({
        title: "Success",
        description: "Profile created successfully!",
      });
      navigate(`/profiles/${data.profile._id}/edit`);
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Floating dots */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 rounded-lg sm:rounded-xl lg:rounded-2xl px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 transition-all duration-300 text-xs sm:text-sm border border-gray-200 bg-white text-gray-600"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Back
            </button>
            <div className="text-center sm:text-left">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-0.5 sm:mb-1">
                Create New Profile
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Add a new professional profile
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <BasicInformation
              profile={profile}
              onInputChange={handleInputChange}
            />

            {/* Skills */}
            <SkillsSection
              profile={profile}
              onAddSkill={addArrayItem}
              onRemoveSkill={removeArrayItem}
            />

            <div className="mb-3 sm:mb-4">
              <EmploymentHistory
                profile={profile}
                onAddEmployment={addEmployment}
                onRemoveEmployment={removeEmployment}
                onArrayChange={handleArrayChange}
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <ProjectsSection
                profile={profile}
                onAddProject={addProject}
                onRemoveProject={removeProject}
                onArrayChange={handleArrayChange}
                onAddProjectSkill={addProjectSkill}
                onRemoveProjectSkill={removeProjectSkill}
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <CertificationsSection
                profile={profile}
                onAddCertification={addArrayItem}
                onRemoveCertification={removeArrayItem}
                onAddCertificationSkill={addCertificationSkill}
                onRemoveCertificationSkill={removeCertificationSkill}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2.5 lg:gap-3 pt-2 sm:pt-3 lg:pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-xs sm:text-sm bg-white text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center btn-modern bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-large hover:shadow-hover transition-all duration-300 rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white/30 border-t-white mr-1.5 sm:mr-2"></div>
                ) : (
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                )}
                <span className="text-xs sm:text-sm">
                  {saving ? "Creating..." : "Create Profile"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
