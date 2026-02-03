import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
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
    <div className="mb-3 sm:mb-4 lg:mb-5">
      <div className="bg-white/60 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/30 backdrop-blur-sm">
        <div className="flex items-center p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${iconBgClass} rounded-md sm:rounded-lg flex items-center justify-center shadow-medium`}
            >
              <span className="text-white text-xs sm:text-sm font-bold">
                {icon}
              </span>
            </div>
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
              {title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
// Fake Toast hook for simplicity
const useToast = () => ({
  toast: (options) => {
    console.log("Toast:", options);
  },
});

export default function ProfileEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, backendUser } = useAuth();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (id && id !== "new") {
      console.log("ProfileEdit useEffect - fetching profile for ID:", id);
      fetchProfile();
    }
  }, [id]);

  useEffect(() => {
    console.log("Profile state updated:", profile);
  }, [profile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/profiles/${id}`);
      console.log("API Response:", response);

      let profileData = response?.profile || response;

      if (profileData.employmentHistory) {
        profileData.employmentHistory = profileData.employmentHistory.map(
          (job) => ({
            ...job,
            startDate: job.startDate
              ? new Date(job.startDate).toISOString().split("T")[0]
              : "",
            endDate: job.endDate
              ? new Date(job.endDate).toISOString().split("T")[0]
              : "",
          })
        );
      }

      if (profileData.projects) {
        profileData.projects = profileData.projects.map((project) => ({
          ...project,
          startDate: project.startDate
            ? new Date(project.startDate).toISOString().split("T")[0]
            : "",
          endDate: project.endDate
            ? new Date(project.endDate).toISOString().split("T")[0]
            : "",
        }));
      }

      console.log("Formatted profile data:", profileData);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field, newItem) => {
    if (field === "certifications") {
      if (newItem.name.trim()) {
        setProfile((prev) => ({
          ...prev,
          [field]: [...prev[field], { ...newItem }],
        }));
      }
    } else if (newItem.trim()) {
      setProfile((prev) => ({
        ...prev,
        [field]: [...prev[field], newItem.trim()],
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addEmployment = () => {
    setProfile((prev) => ({
      ...prev,
      employmentHistory: [
        ...prev.employmentHistory,
        {
          title: "",
          company: "",
          description: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ],
    }));
  };

  const removeEmployment = (index) => {
    setProfile((prev) => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          skills: [],
          isCurrent: false,
        },
      ],
    }));
  };

  const removeProject = (index) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addProjectSkill = (projectIndex, skill) => {
    if (skill.trim()) {
      setProfile((prev) => ({
        ...prev,
        projects: prev.projects.map((project, i) =>
          i === projectIndex
            ? { ...project, skills: [...project.skills, skill.trim()] }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = await api.put(`/api/profiles/${id}`, profile);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      navigate(`/profiles`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold text-red-600 mb-3 sm:mb-4">
            Invalid Profile ID
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
            No profile ID provided for editing.
          </p>
          <button
            onClick={() => navigate("/profiles")}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold"
          >
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  if (loading || !profile || Object.keys(profile).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
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
      <main className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto hover:bg-blue-50 hover:text-blue-700 rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 transition-all duration-300 text-xs sm:text-sm flex items-center justify-center"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2 lg:mr-3" />
              Back
            </button>
            <div className="text-center sm:text-left">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                Edit Profile
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm text-base">
                Update profile information
              </p>
            </div>
          </div>

          {profile && profile.profileName ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInformation
                profile={profile}
                onInputChange={handleInputChange}
              />

              <SkillsSection
                profile={profile}
                onAddSkill={addArrayItem}
                onRemoveSkill={removeArrayItem}
              />


              <div className="mb-4 sm:mb-6">
                <EmploymentHistory
                  profile={profile}
                  onAddEmployment={addEmployment}
                  onRemoveEmployment={removeEmployment}
                  onArrayChange={handleArrayChange}
                />
              </div>


              <div className="mb-4 sm:mb-6">
                <ProjectsSection
                  profile={profile}
                  onAddProject={addProject}
                  onRemoveProject={removeProject}
                  onArrayChange={handleArrayChange}
                  onAddProjectSkill={addProjectSkill}
                  onRemoveProjectSkill={removeProjectSkill}
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <CertificationsSection
                  profile={profile}
                  onAddCertification={addArrayItem}
                  onRemoveCertification={removeArrayItem}
                  onAddCertificationSkill={addCertificationSkill}
                  onRemoveCertificationSkill={removeCertificationSkill}
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3 lg:gap-4 pt-3 sm:pt-4 lg:pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto btn-modern bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-large hover:shadow-hover transition-all duration-300 rounded-lg sm:rounded-xl lg:rounded-2xl px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm font-semibold flex items-center justify-center"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 border-2 border-white/30 border-t-white mr-1.5 sm:mr-2 lg:mr-3"></div>
                  ) : (
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2 lg:mr-3" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-500 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base font-medium">
                Loading profile...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
