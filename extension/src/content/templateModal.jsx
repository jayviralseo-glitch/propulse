import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  fetchTemplates,
  fetchUserProfiles,
  generateProposalWithTemplate,
} from "./utils.js";
import { showProposalInterface } from "./proposalInterface.jsx";
import API_CONFIG from "../config/api.js";

// Icon mapping for Lucide icons
const iconMap = {
  FileText: "📄",
  File: "📋",
  Edit: "✏️",
  MessageSquare: "💬",
  Send: "📤",
  Target: "🎯",
  Lightbulb: "💡",
  Search: "🔍",
  Briefcase: "💼",
  Star: "⭐",
  User: "👤",
  Users: "👥",
  Settings: "⚙️",
  Zap: "⚡",
  TrendingUp: "📈",
  Award: "🏆",
  Heart: "❤️",
  Shield: "🛡️",
  Globe: "🌐",
  Code: "💻",
  HelpCircle: "❓",
  DollarSign: "💰",
  BarChart: "📊",
  Sparkles: "✨",
};

// Function to get icon display
const getIconDisplay = (iconName) => {
  return iconMap[iconName] || "📄"; // Default to FileText if icon not found
};

// Function to show the template selection modal
export function showTemplateModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById("template-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create container for React component
  const modalContainer = document.createElement("div");
  modalContainer.id = "template-modal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
    animation: fadeIn 0.2s ease-out;
  `;

  // Add CSS animations if not already added
  if (!document.getElementById("animations")) {
    const style = document.createElement("style");
    style.id = "animations";
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .template-card:hover {
        transform: translateY(-2px) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Add to page
  document.body.appendChild(modalContainer);

  // Render React component
  const root = ReactDOM.createRoot(modalContainer);
  root.render(<TemplateModal onClose={() => modalContainer.remove()} />);
}

// Main Template Modal Component
function TemplateModal({ onClose }) {
  const [templates, setTemplates] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState(null);
  const [profilesError, setProfilesError] = useState(null);
  const [userProposalCount, setUserProposalCount] = useState(null);
  const [userPlanStatus, setUserPlanStatus] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  // Fetch user info including proposal count and plan status
  const fetchUserInfo = async () => {
    try {
      setSubscriptionLoading(true);
      let token = null;
      try {
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "GET_TOKEN" }, (response) => {
            resolve(response);
          });
        });
        if (response && response.success && response.token) {
          token = response.token;
        } else {
          // Fallback to localStorage
          token = localStorage.getItem("token");
        }
      } catch (error) {
        // Fallback to localStorage
        token = localStorage.getItem("token");
      }

      if (!token) {
        console.log("No token found, skipping user info fetch");
        setSubscriptionLoading(false);
        return;
      }

      const response = await fetch(
        API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.ME),
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(token),
        }
      );

      if (response.ok) {
        const userData = await response.json();

        // Handle different response formats
        let availableProposals, planStatus;

        if (userData.success && userData.user) {
          // Backend format: { success: true, user: { ... } }
          availableProposals = userData.user.availableProposals;
          planStatus = userData.user.planStatus;
        } else if (userData.availableProposals !== undefined) {
          // Direct format: { availableProposals: ..., planStatus: ... }
          availableProposals = userData.availableProposals;
          planStatus = userData.planStatus;
        } else {
          console.error("Invalid user data format:", userData);
          return;
        }

        setUserProposalCount(availableProposals);
        setUserPlanStatus(planStatus);
      } else {
        console.error(
          "Failed to fetch user data:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Error response body:", errorText);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    // Fetch templates
    fetchTemplates()
      .then((templates) => {
        setTemplates(templates);
        setTemplatesLoading(false);
      })
      .catch((error) => {
        setTemplatesError(error);
        setTemplatesLoading(false);
      });

    // Fetch user profiles
    fetchUserProfiles()
      .then((profiles) => {
        setProfiles(profiles);
        setProfilesLoading(false);
        // Auto-select the first profile if available
        if (profiles && profiles.length > 0) {
          setSelectedProfile(profiles[0]);
        }
      })
      .catch((error) => {
        setProfilesError(error);
        setProfilesLoading(false);
      });

    // Fetch user info
    fetchUserInfo();
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleGenerateProposal = async (template) => {
    if (!selectedProfile) {
      alert("Please select a profile first to generate the proposal.");
      return;
    }

    // Wait for subscription data to load before checking
    if (subscriptionLoading) {
      alert("Please wait while we load your subscription details...");
      return;
    }

    // Check if user can generate proposals
    if (userPlanStatus === "expired") {
      alert(
        "Your subscription has expired. Please renew to continue generating proposals."
      );
      return;
    }

    if (userPlanStatus !== "active") {
      alert(
        "You need an active subscription to generate proposals. Please upgrade your plan."
      );
      return;
    }

    if (userProposalCount <= 0) {
      alert(
        "You have no proposals remaining. Please upgrade your plan or wait for next billing cycle."
      );
      return;
    }

    try {
      const proposal = await generateProposalWithTemplate(
        template,
        selectedProfile
      );
      showProposalInterface(proposal, template);

      // Update local proposal count after successful generation
      setUserProposalCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error generating proposal:", error);
      if (error.message.includes("authentication token")) {
        alert("Authentication error. Please refresh the page and try again.");
      } else {
        alert("Error generating proposal. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[100000] font-sans animate-fade-in">
      <div className="bg-white rounded-2xl max-w-6xl w-[98%] max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col">
        {/* Modal header */}
        <div className="flex justify-between items-start px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="flex-1">
            <h2 className="m-0 mb-2 text-white text-[28px] font-bold tracking-[-0.5px]">
              AI Proposal Templates
            </h2>
            <p className="m-0 text-white/80 text-sm font-normal mb-4">
              Choose a template to generate your winning proposal
            </p>

            {/* User Status Display */}
            {subscriptionLoading ? (
              <div className="flex items-center gap-4 mb-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Plan:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white/70">Loading...</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Proposals:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white/70">Loading...</span>
                  </div>
                </div>
              </div>
            ) : userProposalCount !== null ? (
              <div className="flex items-center gap-4 mb-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Plan:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userPlanStatus === "active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {userPlanStatus === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Proposals:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userProposalCount > 0
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {userProposalCount} remaining
                  </span>
                </div>
              </div>
            ) : null}

            {/* Profile Selection */}
            <div className="flex items-center gap-3">
              <label className="text-white/90 text-sm font-medium">
                Select Profile:
              </label>
              <select
                value={selectedProfile?._id || ""}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSelectedProfile(null);
                  } else {
                    const profile = profiles.find(
                      (p) => p._id === e.target.value
                    );
                    setSelectedProfile(profile);
                  }
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 transition-colors"
                disabled={profilesLoading}
              >
                <option value="">-- Select a Profile --</option>
                {profilesLoading ? (
                  <option disabled>Loading profiles...</option>
                ) : profilesError ? (
                  <option disabled>Error loading profiles</option>
                ) : profiles.length === 0 ? (
                  <option disabled>No profiles found</option>
                ) : (
                  profiles.map((profile) => (
                    <option key={profile._id} value={profile._id}>
                      {profile.profileName}
                    </option>
                  ))
                )}
              </select>
              {selectedProfile && (
                <span className="text-white/70 text-xs">
                  {selectedProfile.firstName} {selectedProfile.lastName} •{" "}
                  {selectedProfile.profession}
                </span>
              )}
            </div>

            {/* Warning Message */}
            {!subscriptionLoading && userPlanStatus !== "active" && userPlanStatus !== "expired" && userPlanStatus !== null && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm font-medium">
                  ⚠️ You need an active subscription to generate proposals
                </p>
              </div>
            )}
            {!subscriptionLoading && userPlanStatus === "expired" && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm font-medium">
                  ⚠️ Your subscription has expired. Please renew to continue
                  generating proposals.
                </p>
              </div>
            )}
            {!subscriptionLoading && userPlanStatus === "active" && userProposalCount <= 0 && (
              <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm font-medium">
                  ⚠️ You have no proposals remaining. Please upgrade your plan
                  or wait for next billing cycle.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="bg-white/10 border border-white/20 rounded-lg p-2 cursor-pointer text-white flex items-center justify-center transition-all duration-200 ease-out backdrop-blur-sm hover:bg-white/20 hover:border-white/30"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templatesLoading && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-5 text-center">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-3" />
                <div className="text-gray-500 text-sm font-medium">
                  Loading AI templates...
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Preparing your proposal options
                </div>
              </div>
            )}

            {templatesError && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-5 text-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="mb-3"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
                <div className="text-red-500 text-base font-semibold mb-2">
                  Failed to Load Templates
                </div>
                <div className="text-gray-500 text-sm">
                  Please check your connection and try again
                </div>
              </div>
            )}

            {!templatesLoading &&
              !templatesError &&
              templates.map((template, index) => (
                <TemplateCard
                  key={template.id || index}
                  template={template}
                  index={index}
                  onGenerate={handleGenerateProposal}
                  selectedProfile={selectedProfile}
                  subscriptionLoading={subscriptionLoading}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Template Card Component
function TemplateCard({ template, index, onGenerate, selectedProfile, subscriptionLoading }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async (e) => {
    e.stopPropagation();

    if (generating) return;

    setGenerating(true);
    setError(false);

    try {
      await onGenerate(template);
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setGenerating(false);
    }
  };

  const featuresList = template.features || [
    "Professional tone",
    "Customizable",
    "AI-optimized",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 ease-out cursor-pointer relative overflow-hidden animate-slide-up hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 group">
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

      {/* Template icon and name */}
      <div className="flex items-start mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-lg filter grayscale brightness-0 invert">
            {getIconDisplay(template.icon)}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="m-0 mb-1 text-sm font-bold text-gray-900 leading-tight">
            {template.name}
          </h3>
          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-1.5 py-0.5 rounded text-xs uppercase tracking-wider">
            {template.category || "General"}
          </span>
        </div>
      </div>

      {/* Template description */}
      <p className="m-0 mb-3 text-gray-500 text-xs leading-relaxed line-clamp-2">
        {template.description}
      </p>

      {/* Features list */}
      <div className="mb-3">
        {featuresList.slice(0, 2).map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center mb-1 text-xs text-gray-500"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              className="mr-1.5 flex-shrink-0"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
            {feature}
          </div>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generating || !selectedProfile || subscriptionLoading}
        className={`w-full rounded-md px-3 py-2 text-xs font-semibold cursor-pointer transition-all duration-200 ease-out flex items-center justify-center gap-1.5 shadow-sm ${
          generating
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
            : error
            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
            : !selectedProfile || subscriptionLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:-translate-y-0.5 hover:shadow-sm"
        }`}
      >
        {generating ? (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Generating...
          </>
        ) : subscriptionLoading ? (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Loading...
          </>
        ) : error ? (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            Try Again
          </>
        ) : !selectedProfile ? (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Select Profile First
          </>
        ) : (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Generate
          </>
        )}
      </button>
    </div>
  );
}
