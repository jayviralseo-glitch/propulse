import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import API_CONFIG from "../config/api.js";

// Profile Import Modal Component
function ProfileImportModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [extractedData, setExtractedData] = useState(null);

  // Cleanup effect to ensure modal container is removed
  useEffect(() => {
    // Handle click outside to close modal
    const handleClickOutside = (event) => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && !modalContent.contains(event.target)) {
        handleClose();
      }
    };

    // Handle escape key to close modal
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup event listeners
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);

      // This will run when component unmounts
      const modalContainer = document.getElementById("profile-import-modal");
      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Call the parent's onClose function for proper cleanup
    if (onClose) {
      onClose();
    }
  };

  const handleImportProfile = async () => {
    setIsLoading(true);
    setStatus("Extracting profile data...");

    try {
      // Extract profile data using your exact selectors
      const data = await extractUpworkProfileData();

      if (data.success) {
        setExtractedData(data.profileData);
        setStatus("✅ Profile data extracted successfully!");

        // Debug logging - Extracted data

        // Send to backend
        setStatus("📤 Sending to backend...");
        const apiResponse = await sendProfileToBackend(data.profileData);

        if (apiResponse.success) {
          setStatus("🎉 Profile created successfully!");
        } else {
          throw new Error(apiResponse.error || "Failed to create profile");
        }
      } else {
        throw new Error(data.error || "Failed to extract profile data");
      }
    } catch (error) {
      console.error("Import profile error:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to extract profile data using your exact selectors
  const extractUpworkProfileData = async () => {
    try {
      const profileData = {};

      // Extract profile title using multiple selectors for robustness
      let titleElement = null;
      let title = "";

      // Try multiple selectors in order of preference
      const titleSelectors = [
        ".span-10 > h2",
        ".span-10 h2",
        "h2.mb-0.h4",
        ".air3-grid-container .span-10 h2",
        "h2[class*='mb-0']",
        "h2",
      ];

      for (const selector of titleSelectors) {
        titleElement = document.querySelector(selector);
        if (titleElement && titleElement.textContent.trim()) {
          break;
        }
      }

      if (titleElement) {
        // Clean the title text - remove button text and extra whitespace
        title = titleElement.textContent
          .replace(/Edit title/g, "")
          .replace(/\s+/g, " ")
          .trim();

        profileData.profileName = title;
        profileData.profession = title; // profession is the same as title
      } else {
        // Title element not found with any selector
      }

      // Extract profile name
      const nameElement = document.querySelector(".identity-content h2");
      if (nameElement) {
        const fullName = nameElement.textContent.trim();
        const nameParts = fullName.split(" ");
        profileData.firstName = nameParts[0] || "";
        profileData.lastName = nameParts.slice(1).join(" ") || "";
      }

      // Extract profile description using the correct selector
      // Try multiple selectors for profile description since the ID can vary
      const descriptionSelectors = [
        "#air3-line-clamp-1 span.text-body",
        "#air3-line-clamp-1 span",
        ".air3-line-clamp span.text-body",
        ".air3-line-clamp span.text-pre-line",
        ".air3-line-clamp span",
        "[id^='air3-line-clamp'] span.text-body",
        "[id^='air3-line-clamp'] span",
      ];

      let profileDescription = "";
      for (const selector of descriptionSelectors) {
        const descElement = document.querySelector(selector);
        if (descElement && descElement.textContent.trim()) {
          profileDescription = descElement.textContent.trim();
          // Profile description found
          break;
        }
      }

      if (profileDescription) {
        profileData.description = profileDescription;
      }

      // Extract skills using the exact selector
      const skillElements = document.getElementsByClassName("skill-name");
      if (skillElements.length > 0) {
        profileData.skills = Array.from(skillElements).map((el) =>
          el.textContent.trim()
        );
      }

      // Extract employment history using the correct selectors
      const employmentHistory = [];
      const jobEntryElements = document.querySelectorAll(
        ".air3-card-sections .air3-card-section.px-0"
      );

      // Filter elements to only include actual employment (not certifications/skills)
      const filteredElements = Array.from(jobEntryElements).filter(
        (element) => {
          const titleElement = element.querySelector("h4");
          if (!titleElement) return false;

          const title = titleElement.textContent.toLowerCase();

          // Skip if it's clearly a certification/skill badge
          const skipKeywords = [
            "badge",
            "certification",
            "credly",
            "verified",
            "skill",
            "mongo",
            "schema",
            "pattern",
            "anti-pattern",
            "relational",
            "advanced",
            "design",
            "model",
            "skill badge",
          ];

          const shouldSkip = skipKeywords.some((keyword) =>
            title.includes(keyword)
          );

          // Debug logging for filtering
          if (shouldSkip) {
            // Skipping this element
          }

          return !shouldSkip;
        }
      );

      filteredElements.forEach((jobElement) => {
        const titleElement = jobElement.querySelector("h4");
        let title = titleElement?.textContent || "";

        title = title
          .replace(/\s+/g, " ")
          .split("Edit")[0]
          .split("Delete")[0]
          .trim();

        const datesElement = jobElement.querySelector(
          ".mt-3x.text-light-on-inverse"
        );
        let dates = datesElement?.textContent || "";

        dates = dates.replace(/\s+/g, " ").trim();

        // Try multiple selectors for description
        let description = "";
        const descriptionSelectors = [
          ".air3-line-clamp-wrapper span.text-light",
          ".air3-line-clamp span.text-light",
          ".air3-line-clamp-wrapper span",
          ".air3-line-clamp span",
          "span.text-light",
          "p.text-light",
          ".description",
          ".job-description",
        ];

        for (const selector of descriptionSelectors) {
          const descElement = jobElement.querySelector(selector);
          if (descElement && descElement.textContent.trim()) {
            description = descElement.textContent.replace(/\s+/g, " ").trim();
            break;
          }
        }

        // Description is now optional, so empty string is fine

        // Parse dates and determine if current
        const { startDate, endDate, isCurrent } = parseDates(dates);

        // Debug logging for employment history

        employmentHistory.push({
          title: title,
          company: "Company", // Default value since not in your selectors
          description: description,
          startDate: startDate ? startDate.toISOString().split("T")[0] : "", // Convert to string format like frontend
          endDate: endDate ? endDate.toISOString().split("T")[0] : "", // Convert to string format like frontend
          isCurrent: isCurrent,
        });
      });

      profileData.employmentHistory = employmentHistory;

      // Extract portfolio projects
      const projects = [];
      const projectLinkElements = document.querySelectorAll(
        '.air3-grid-container.mt-6x .span-md-4 a[href="javascript:"]'
      );

      if (projectLinkElements.length > 0) {
        projectLinkElements.forEach((link, index) => {
          const projectName = link.textContent.trim();

          projects.push({
            name: projectName,
            description: `Project ${index + 1}`, // Default description
            startDate: "", // Empty string like frontend
            endDate: "", // Empty string like frontend
            isCurrent: false,
          });
        });
      }

      profileData.projects = projects;

      // Extract certifications (optional - only if they exist)
      try {
        const certifications = [];
        const certificationElements = document.querySelectorAll(
          '[data-testid="certificate-wrapper"]'
        );

        if (certificationElements.length > 0) {
          certificationElements.forEach((certElement, index) => {
            const titleElement = certElement.querySelector("h4");
            const title = titleElement?.textContent.trim() || "";

            const verificationElement =
              certElement.querySelector(".verification span");
            const verification = verificationElement?.textContent.trim() || "";

            const providerElement = certElement.querySelector(".mb-2x");
            const provider =
              providerElement?.textContent.replace("Provider:", "").trim() ||
              "";

            const issueDateElement = certElement.querySelector(
              ".mb-2x:last-child span"
            );
            const issueDate =
              issueDateElement?.textContent.replace("Issued:", "").trim() || "";

            // Extract skills from this certification
            const certSkills = [];
            const skillElements = certElement.querySelectorAll(".skill-name");
            skillElements.forEach((skillEl) => {
              const skillText = skillEl.textContent.trim();
              if (skillText && !certSkills.includes(skillText)) {
                certSkills.push(skillText);
              }
            });

            const certification = {
              name: title,
              issuer: provider,
              issueDate: issueDate,
              verification: verification,
              skills: certSkills,
            };

            certifications.push(certification);
          });

          profileData.certifications = certifications;
        } else {
          profileData.certifications = [];
        }
      } catch (certError) {
        profileData.certifications = [];
      }

      return {
        success: true,
        profileData: profileData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Helper function to parse dates from Upwork format
  const parseDates = (dateString) => {
    try {
      // Handle common Upwork date formats
      if (dateString.includes("Present") || dateString.includes("Current")) {
        return {
          startDate: new Date(),
          endDate: null,
          isCurrent: true,
        };
      }

      // Try to extract year ranges like "2020 - 2023" or "2020 - Present"
      const yearMatch = dateString.match(
        /(\d{4})\s*-\s*(\d{4}|Present|Current)/
      );
      if (yearMatch) {
        const startYear = parseInt(yearMatch[1]);
        const endYear = yearMatch[2];

        return {
          startDate: new Date(startYear, 0, 1), // January 1st of start year
          endDate:
            endYear === "Present" || endYear === "Current"
              ? null
              : new Date(parseInt(endYear), 11, 31),
          isCurrent: endYear === "Present" || endYear === "Current",
        };
      }

      // Default fallback
      return {
        startDate: null,
        endDate: null,
        isCurrent: false,
      };
    } catch (error) {
      return {
        startDate: null,
        endDate: null,
        isCurrent: false,
      };
    }
  };

  // Function to send profile data to backend
  const sendProfileToBackend = async (profileData) => {
    try {
      // Get token from extension storage instead of localStorage
      let token = null;

      try {
        // Try to get token from extension storage via background script
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "GET_TOKEN" }, (response) => {
            resolve(response);
          });
        });

        if (response && response.success && response.token) {
          token = response.token;
        } else {
          // Fallback to localStorage if extension storage fails
          token = localStorage.getItem("token");
        }
      } catch (error) {
        // Extension storage failed, trying localStorage
        // Fallback to localStorage
        token = localStorage.getItem("token");
      }

      if (!token) {
        throw new Error(
          "No authentication token found. Please login to the website first."
        );
      }

      // Prepare data for backend
      const backendData = {
        profileName: profileData.profileName,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profession: profileData.profession,
        description: profileData.description,
        skills: profileData.skills || [],
        employmentHistory: profileData.employmentHistory || [],
        certifications: profileData.certifications || [],
        projects: profileData.projects || [],
      };

      // Debug logging - Extension data being sent

      // Send to backend API
      const response = await fetch(
        API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PROFILES.CREATE),
        {
          method: "POST",
          headers: API_CONFIG.getAuthHeaders(token),
          body: JSON.stringify(backendData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create profile");
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Backend API error:", error);
      return { success: false, error: error.message };
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-[100000] font-sans animate-fade-in">
      <div className="modal-content bg-white rounded-2xl max-w-2xl w-[95%] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="m22 2-7 7" />
                  <path d="m15 2 7 7-7 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Import Profile</h2>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-2 transition-all duration-200"
            >
              <svg
                width="16"
                height="16"
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
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 2-7 7" />
                <path d="m15 2 7 7-7 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Import Profile from Upwork
            </h3>

            <p className="text-gray-600 text-lg mb-6">
              Extract your profile data and create a new profile automatically
            </p>

            <button
              onClick={handleImportProfile}
              disabled={isLoading}
              className={`inline-flex items-center px-6 py-3 text-white text-sm font-medium rounded-lg transition-colors duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "📥 Import Profile"
              )}
            </button>

            {/* Status Display */}
            {status && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  status.includes("✅") || status.includes("🎉")
                    ? "bg-green-100 text-green-800"
                    : status.includes("❌")
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {status}
              </div>
            )}

            {/* Extracted Data Preview */}
            {extractedData && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Extracted Data Preview:
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <strong>Profile Name:</strong>{" "}
                    {extractedData.profileName || "N/A"}
                  </div>
                  <div>
                    <strong>Skills:</strong> {extractedData.skills?.length || 0}{" "}
                    skills found
                  </div>
                  <div>
                    <strong>Employment History:</strong>{" "}
                    {extractedData.employmentHistory?.length || 0} entries
                  </div>
                  <div>
                    <strong>Projects:</strong>{" "}
                    {extractedData.projects?.length || 0} projects
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Function to show the profile import modal
export function showProfileImportModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById("profile-import-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create container for React component
  const modalContainer = document.createElement("div");
  modalContainer.id = "profile-import-modal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100000;
  `;

  // Add to page
  document.body.appendChild(modalContainer);

  // Render React component with proper cleanup
  const root = ReactDOM.createRoot(modalContainer);

  // Create a wrapper component that handles cleanup
  const ModalWrapper = () => {
    const handleClose = () => {
      // Unmount React component
      root.unmount();
      // Remove container from DOM
      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }
    };

    return <ProfileImportModal onClose={handleClose} />;
  };

  root.render(<ModalWrapper />);
}
