import API_CONFIG from "../config/api.js";

class PopupManager {
  constructor() {
    this.init();
  }

  async init() {
    console.log("📱 Popup initializing...");

    // Debug: Show what's in storage
    chrome.storage.local.get(
      ["jwtToken", "userData", "lastUpdated"],
      (result) => {
        console.log("📱 Raw storage data:", result);
        console.log("📱 Has token:", !!result.jwtToken);
        console.log("📱 Has userData:", !!result.userData);
        console.log("📱 userData contents:", result.userData);
      },
    );

    await this.checkAuthentication();
    this.setupRefreshButton();
  }

  async checkAuthentication() {
    try {
      // Get token from background script
      const response = await this.getMessageFromBackground("GET_TOKEN");

      console.log("📱 Popup: Got response from background:", response);
      console.log("📱 Popup: User data:", response.user);
      console.log("📱 Popup: Token exists:", !!response.token);

      if (response.success && response.token) {
        this.showAuthenticatedUser(
          response.user,
          response.token,
          response.source,
        );
      } else {
        this.showNotAuthenticated();
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      this.showNotAuthenticated();
    }
  }

  async refreshAuthentication() {
    console.log("Refreshing authentication...");

    try {
      // Get current token from background
      const response = await this.getMessageFromBackground("GET_TOKEN");
      console.log("📱 Got token response:", response);

      if (response.success && response.token) {
        console.log("📱 Token exists, fetching fresh user data...");
        // Manually fetch fresh user data
        const freshUserData = await this.fetchFreshUserData(response.token);
        console.log("📱 Fresh user data:", freshUserData);

        if (freshUserData) {
          // Update the stored data with fresh user info
          await this.updateStoredUserData(response.token, freshUserData);
          console.log("Fresh user data fetched and stored");
          console.log("📱 Updated user email:", freshUserData.email);
        } else {
          console.error("📱 Failed to fetch fresh user data");
        }

        // Refresh the display
        await this.checkAuthentication();
      } else {
        console.log("📱 No token found, checking auth status...");
        await this.checkAuthentication();
      }
    } catch (error) {
      console.error("Error refreshing authentication:", error);
      await this.checkAuthentication();
    }
  }

  async fetchFreshUserData(token) {
    try {
      console.log("🔍 Popup: Attempting to fetch user data from API...");

      // Fetch fresh user data from the BACKEND API
      const response = await fetch(
        API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.ME),
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(token),
        },
      );

      console.log("🔍 Popup: API Response status:", response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log(
          "🔍 Popup: API Response text (first 200 chars):",
          responseText.substring(0, 200),
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
            "Popup: Failed to parse API response as JSON:",
            parseError,
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

  async updateStoredUserData(token, userData) {
    try {
      // Send message to background script to update stored data
      await this.getMessageFromBackground("UPDATE_USER_DATA", {
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Error updating stored user data:", error);
    }
  }

  getMessageFromBackground(type, data = null) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, ...data }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Runtime error:", chrome.runtime.lastError);
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: false, error: "No response" });
        }
      });
    });
  }

  showAuthenticatedUser(user, token, source) {
    const userInfoDiv = document.getElementById("userInfo");

    console.log("📱 Popup: showAuthenticatedUser called with user:", user);
    console.log("📱 Popup: user.name =", user?.name);
    console.log("📱 Popup: user.email =", user?.email);

    // Extract user initials for avatar
    const initials = this.getInitials(user?.name || user?.email || "User");

    userInfoDiv.innerHTML = `
      <div class="user-avatar">${initials}</div>
      <div class="user-name">${user?.name || "User"}</div>
      <div class="user-email">${user?.email || "No email"}</div>
      <div class="auth-status authenticated">✅ Authenticated</div>
      <div class="sync-info">
        <small>Token synced: ${new Date().toLocaleTimeString()}</small>
        <br>
        <small style="opacity: 0.7;">Source: ${source || "Unknown"}</small>
      </div>
    `;
  }

  showNotAuthenticated() {
    const userInfoDiv = document.getElementById("userInfo");

    userInfoDiv.innerHTML = `
     
      <div class="user-name">Not Authenticated</div>
      <div class="user-email">Please login to the website first</div>
      <div class="auth-status not-authenticated">❌ Not Authenticated</div>
      <div class="sync-info">
        <small>Go to <a href="http://localhost:5173" target="_blank" style="color: #22c55e;">ProPulse</a> to login</small>
      </div>
    `;
  }

  getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  setupRefreshButton() {
    // Add refresh functionality
    document.addEventListener("click", async (e) => {
      if (
        e.target.textContent.includes("Refresh") ||
        e.target.classList.contains("refresh-btn")
      ) {
        console.log("Refresh button clicked");
        e.target.textContent = "🔄 Refreshing...";
        e.target.disabled = true;

        try {
          await this.refreshAuthentication();
        } finally {
          e.target.textContent = "🔄 Refresh Token";
          e.target.disabled = false;
        }
      }
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PopupManager();
});

// Listen for token updates from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TOKEN_UPDATED") {
    console.log("Token updated, refreshing popup...");
    // Refresh the popup when token is updated
    window.location.reload();
  }
});

// Also listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && (changes.jwtToken || changes.userData)) {
    console.log("Storage changed, refreshing popup...");
    // Refresh the popup when storage changes
    window.location.reload();
  }
});
