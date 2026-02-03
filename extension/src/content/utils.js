import API_CONFIG from "../config/api.js";

// Function to extract job description from the page
export function extractJobDescription() {
  try {
    const descriptionElement = document.querySelector(
      ".description .air3-truncation span span"
    );
    if (descriptionElement) {
      return descriptionElement.textContent.trim();
    }
    const fallbackElement = document.querySelector(".description");
    if (fallbackElement) {
      return fallbackElement.textContent.trim();
    }
    return null;
  } catch (error) {
    console.error("Error extracting job description:", error);
    return null;
  }
}

// Function to show a toast message
export function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 100001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease;
  `;

  // Add animation CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
    style.remove();
  }, 3000);
}

// Function to paste proposal to the textarea
export function pasteToTextarea(proposal) {
  const textarea = document.querySelector(
    'textarea[data-v-cf0298f4][class*="air3-textarea"][class*="inner-textarea"]'
  );

  if (textarea) {
    // Focus the textarea
    textarea.focus();

    // Set the value
    textarea.value = proposal;

    // Trigger input event to update any Vue.js bindings
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    // Show success message
    showToast("Proposal pasted to cover letter textarea!");

    return true;
  } else {
    alert(
      "Cover letter textarea not found. Please make sure you're on the proposal form."
    );
    return false;
  }
}

// Function to fetch templates from backend
export async function fetchTemplates() {
  try {
    const response = await fetch(
      API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.TEMPLATES.LIST)
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
}

// Function to fetch user profiles from backend
export async function fetchUserProfiles() {
  try {
    // Get token from extension storage
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
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PROFILES.LIST),
      {
        method: "GET",
        headers: API_CONFIG.getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.profiles || [];
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
}

// Function to generate proposal with specific template and profile
export async function generateProposalWithTemplate(template, selectedProfile) {
  try {
    const jobDescription = extractJobDescription();
    if (!jobDescription) {
      alert("No job description found. Please make sure you're on a job page.");
      return;
    }

    if (!selectedProfile) {
      alert("Please select a profile to generate the proposal.");
      return;
    }

    // Get token from extension storage
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
      throw new Error(
        "No authentication token found. Please login to the website first."
      );
    }

    // Call backend with template and profile
    const response = await fetch(
      API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PROPOSALS.GENERATE),
      {
        method: "POST",
        headers: API_CONFIG.getAuthHeaders(token),
        body: JSON.stringify({
          jobDescription,
          templateId: template._id,
          profileId: selectedProfile._id,
          proposalUrl: window.location.href,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error === "Plan expired") {
        throw new Error(
          "Your subscription has expired. Please renew to continue generating proposals."
        );
      } else if (errorData.error === "Inactive plan") {
        throw new Error(
          "You need an active subscription to generate proposals. Please upgrade your plan."
        );
      } else if (errorData.error === "No proposals left") {
        throw new Error(
          "You have no proposals remaining. Please upgrade your plan or wait for next billing cycle."
        );
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    const proposal = data.proposal;

    // Show remaining proposals count
    if (data.remainingProposals !== undefined) {
      showToast(
        `Proposal generated! ${data.remainingProposals} proposals remaining.`
      );
    } else {
      showToast("Proposal generated successfully!");
    }

    return proposal;
  } catch (error) {
    console.error("Error generating proposal:", error);
    throw error;
  }
}
