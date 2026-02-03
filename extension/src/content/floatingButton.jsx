import React from "react";
import ReactDOM from "react-dom/client";
import { showProfileImportModal } from "./profileImportModal.jsx";

// Floating Button Component
function FloatingButton() {
  const handleClick = () => {
    // Check if we're on a freelancer profile page
    const isOnProfilePage =
      window.location.pathname.includes("/freelancers/") &&
      window.location.pathname !== "/freelancers/" &&
      !window.location.pathname.endsWith("/freelancers/");

    if (isOnProfilePage) {
      // If on a profile page, open the profile import modal
      showProfileImportModal();
    } else {
      // If not on a profile page, redirect to Upwork freelancers page
      window.open("https://www.upwork.com/freelancers/", "_blank");
    }
  };

  // Determine button text and tooltip based on current page
  const isOnProfilePage =
    window.location.pathname.includes("/freelancers/") &&
    window.location.pathname !== "/freelancers/" &&
    !window.location.pathname.endsWith("/freelancers/");

  const buttonTitle = isOnProfilePage
    ? "Import This Profile"
    : "Browse Freelancers";
  const tooltipText = isOnProfilePage
    ? "Import This Profile"
    : "Go to Freelancers Page";

  return (
    <div className="fixed right-6 bottom-6 z-[99999]">
      <button
        onClick={handleClick}
        className={`rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-110 group ${
          isOnProfilePage
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        }`}
        title={buttonTitle}
      >
        {/* Icon - Using the same UserPlus icon for both contexts */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white transition-transform duration-300 group-hover:scale-110"
        >
          {/* User icon with plus sign */}
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {tooltipText}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>
    </div>
  );
}

// Function to show the floating button on all pages
export function showFloatingButton() {
  // Remove existing button if any
  const existingButton = document.getElementById("floating-button");
  if (existingButton) {
    existingButton.remove();
  }

  // Create container for the floating button
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "floating-button";
  buttonContainer.style.cssText = `
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 99999;
  `;

  // Add to page
  document.body.appendChild(buttonContainer);

  // Render React component
  const root = ReactDOM.createRoot(buttonContainer);
  root.render(<FloatingButton />);
}
