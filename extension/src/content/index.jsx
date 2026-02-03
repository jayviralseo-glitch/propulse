import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { showTemplateModal } from "./templateModal.jsx";
import { showProposalInterface } from "./proposalInterface.jsx";
import { showFloatingButton } from "./floatingButton.jsx";
import { showProfileImportModal } from "./profileImportModal.jsx";
import API_CONFIG from "../config/api.js";
import "./styles.css";

// Token sync functionality for extension
class ExtensionTokenSync {
  constructor() {
    this.init();
  }

  init() {
    // Monitor localStorage changes for token updates
    this.monitorLocalStorage();

    // Initial sync if token exists
    this.syncTokenIfExists();
  }

  monitorLocalStorage() {
    // Override localStorage.setItem to detect changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key, value) => {
      originalSetItem.call(localStorage, key, value);

      // If token or user data changed, sync with extension immediately
      if (key === "token" || key === "user") {
        console.log(
          `LocalStorage changed: ${key}`,
          value
            ? key === "token"
              ? `${value.substring(0, 20)}...`
              : value
            : null
        );
        this.syncWithExtension();
      }
    };

    // Also listen for storage events (in case of cross-tab changes)
    window.addEventListener("storage", (e) => {
      if (e.key === "token" || e.key === "user") {
        console.log(`Storage event: ${e.key} changed`);
        this.syncWithExtension();
      }
    });

    // Monitor for token changes more aggressively
    this.startTokenMonitoring();
  }

  startTokenMonitoring() {
    // Check for token changes every 2 seconds
    setInterval(() => {
      const currentToken = localStorage.getItem("token");
      const currentUser = localStorage.getItem("user");

      if (this.lastToken !== currentToken || this.lastUser !== currentUser) {
        console.log("Token or user changed, syncing with extension");
        this.lastToken = currentToken;
        this.lastUser = currentUser;
        this.syncWithExtension();
      }
    }, 2000);
  }

  syncTokenIfExists() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      this.syncWithExtension();
    }
  }

  async syncWithExtension() {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Instead of sending localStorage user data, fetch fresh user data from API
        const userData = await this.fetchFreshUserData(token);

        // Send token to extension background script
        chrome.runtime.sendMessage({
          type: "STORE_TOKEN",
          token: token,
          user: userData,
        });
      }
    } catch (error) {
      console.error("Error syncing with extension:", error);
    }
  }

  async fetchFreshUserData(token) {
    try {
      console.log(
        "🔍 Content script: Attempting to fetch user data from API..."
      );

      // Fetch fresh user data from the BACKEND API
      const response = await fetch(
        API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.ME),
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(token),
        }
      );

      console.log("🔍 Content script: API Response status:", response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log(
          "🔍 Content script: API Response text (first 200 chars):",
          responseText.substring(0, 200)
        );

        try {
          const data = JSON.parse(responseText);
          if (data.success && data.user) {
            console.log("Fresh user data fetched:", data.user.email);
            return data.user;
          } else {
            console.error("Failed to get user data from API:", data);
            return null;
          }
        } catch (parseError) {
          console.error(
            "Content script: Failed to parse API response as JSON:",
            parseError
          );
          console.error("Response was:", responseText);
          return null;
        }
      } else {
        console.error("Failed to fetch user data, status:", response.status);
        const errorText = await response.text();
        console.error("Error response body:", errorText.substring(0, 200));
        return null;
      }
    } catch (error) {
      console.error("Error fetching fresh user data:", error);
      return null;
    }
  }
}

// Initialize token sync
const tokenSync = new ExtensionTokenSync();

// Make functions available globally for cross-module communication
window.showTemplateModal = showTemplateModal;
window.showTemplateInterface = showProposalInterface;

// Main Extension Component for Job Proposal Pages
function ProPulseExtension() {
  const handleTemplateClick = () => {
    showTemplateModal();
  };

  return (
    <div className="my-4 flex items-center gap-3">
      <button
        id="template-btn"
        onClick={handleTemplateClick}
        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ease-out font-sans shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 relative overflow-hidden group"
      >
        <span className="relative z-10">Generate AI Proposal</span>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-left duration-500 group-hover:left-full" />
      </button>

      {/* AI badge */}
      <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
        AI
      </span>
    </div>
  );
}

// Function to wait for a specific element to appear
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    // Check if element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // Set up observer to watch for element
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Set timeout as fallback
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Function to place the proposal button on job pages
async function placeProposalButton() {
  try {
    // Wait for the specific element to appear
    const attachmentsArea = await waitForElement(".attachments-area.mt-6x");

    // Check if button already exists
    if (document.getElementById("extension-root")) {
      return;
    }

    // First, try to expand the job description by clicking "more" button
    const moreButton = document.querySelector(
      'button[data-ev-label="truncation_toggle"]'
    );
    if (moreButton && moreButton.textContent.toLowerCase().includes("more")) {
      moreButton.click();
    }

    // Insert the button just above the attachments area
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "extension-root";
    attachmentsArea.parentNode.insertBefore(buttonContainer, attachmentsArea);

    // Render React component
    const root = ReactDOM.createRoot(buttonContainer);
    root.render(<ProPulseExtension />);
  } catch (error) {
    // Check if button already exists
    if (document.getElementById("extension-root")) {
      return;
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "extension-root";
    document.body.appendChild(buttonContainer);

    // Render React component
    const root = ReactDOM.createRoot(buttonContainer);
    root.render(<ProPulseExtension />);
  }
}

// Main initialization function
async function initializeExtension() {
  // Safety check: Only run on Upwork domains
  if (!window.location.hostname.includes("upwork.com")) {
    return;
  }

  // Always show floating button on all Upwork pages
  showFloatingButton();

  // Check if we're on the freelancers page
  if (
    window.location.pathname.includes("/freelancers/") &&
    window.location.pathname !== "/freelancers/" &&
    !window.location.pathname.endsWith("/freelancers/")
  ) {
    // Wait for page to fully load and check if user has existing profiles
    const checkAndShowModal = async () => {
      try {
        // Wait for page to be fully loaded
        if (document.readyState !== "complete") {
          await new Promise((resolve) => {
            window.addEventListener("load", resolve, { once: true });
          });
        }

        // Additional wait for Upwork's dynamic content to load
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Check if user has existing profiles before showing modal
        const hasExistingProfiles = await checkUserProfiles();

        if (!hasExistingProfiles) {
          // Only show modal if user has no existing profiles
          showProfileImportModal();
        }
      } catch (error) {
        console.error("Error checking user profiles:", error);
        // Fallback: don't show modal if there's an error
      }
    };

    // Start the check process
    checkAndShowModal();
  }

  // Check if we're on the specific job proposal page
  if (window.location.pathname.includes("/nx/proposals/job/")) {
    // Wait for the specific element to render
    placeProposalButton();
  }
}

// Function to check if user has existing profiles
async function checkUserProfiles() {
  try {
    // Get token from extension storage or localStorage
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
      // No token means user is not logged in, don't show modal
      return true; // Pretend user has profiles to avoid showing modal
    }

    // Check backend for existing profiles
    const response = await fetch(
      API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PROFILES.LIST),
      {
        method: "GET",
        headers: API_CONFIG.getAuthHeaders(token),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.profiles && data.profiles.length > 0) {
        // User has existing profiles
        return true;
      }
    }

    // User has no existing profiles
    return false;
  } catch (error) {
    console.error("Error checking user profiles:", error);
    // On error, assume user has profiles to avoid showing modal
    return true;
  }
}

// Initialize the extension when the script loads
initializeExtension();
