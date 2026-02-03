import API_CONFIG from "../config/api.js";

// Background service worker for ProPulse extension

// JWT Token Sync between website and extension - Only localhost:5173
class TokenSync {
  constructor() {
    this.init();
  }

  init() {
    // Listen for messages from content script and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "GET_TOKEN") {
        this.getStoredToken(sendResponse);
        return true; // Keep message channel open for async response
      }
      if (request.type === "STORE_TOKEN") {
        this.storeToken(request.token, request.user);
      }
      if (request.type === "UPDATE_USER_DATA") {
        this.storeToken(request.token, request.user);
        sendResponse({ success: true });
      }
    });

    // Listen for tab updates to catch when localhost:5173 is opened
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && this.isOurWebsite(tab.url)) {
        this.syncTokenFromTab(tabId);
      }
    });

    // Listen for tab activation to sync immediately
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (this.isOurWebsite(tab.url)) {
        this.syncTokenFromTab(tab.id);
      }
    });

    // Periodically check for token changes and clear old data
    this.startPeriodicTokenCheck();
  }

  startPeriodicTokenCheck() {
    // Check every 30 seconds for token changes
    setInterval(async () => {
      try {
        const stored = await chrome.storage.local.get([
          "jwtToken",
          "lastUpdated",
        ]);
        if (stored.jwtToken && stored.lastUpdated) {
          const timeSinceUpdate = Date.now() - stored.lastUpdated;
          // If data is older than 5 minutes, it might be stale
          if (timeSinceUpdate > 5 * 60 * 1000) {
            console.log("Token data might be stale, checking for updates...");
            // Try to sync from any open tabs
            const tabs = await chrome.tabs.query({
              url: ["http://localhost:5173/*", "https://propulse-pied.vercel.app/*"],
            });
            if (tabs.length > 0) {
              await this.syncTokenFromTab(tabs[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Error in periodic token check:", error);
      }
    }, 30000); // 30 seconds
  }

  isOurWebsite(url) {
    if (!url) return false;
    return url.includes("localhost:5173") || url.includes("propulse-pied.vercel.app");
  }

  async getStoredToken(sendResponse) {
    try {
      // Get token from extension storage
      const stored = await chrome.storage.local.get(["jwtToken", "userData"]);

      if (stored.jwtToken) {
        sendResponse({
          success: true,
          token: stored.jwtToken,
          user: stored.userData,
          source: "stored",
          timestamp: Date.now(),
        });
      } else {
        sendResponse({ success: false, error: "No token found" });
      }
    } catch (error) {
      console.error("Error getting stored token:", error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async syncTokenFromTab(tabId) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          return {
            token: localStorage.getItem("token"),
            user: localStorage.getItem("user"),
            timestamp: Date.now(),
          };
        },
      });

      const result = results[0]?.result;
      if (result && result.token) {
        // Check if this is a different user (different token)
        const stored = await chrome.storage.local.get(["jwtToken"]);
        if (stored.jwtToken && stored.jwtToken !== result.token) {
          // Different user logged in, clear old data first
          await this.clearStoredToken();
          console.log("Different user detected, cleared old data");
        }

        // Instead of relying on localStorage user data, fetch fresh user data from the API
        await this.fetchAndStoreUserData(result.token);
        console.log(
          "Token synced and fresh user data fetched from localhost:5173"
        );
      }
    } catch (error) {
      console.error("Error syncing token from tab:", error);
    }
  }

  async fetchAndStoreUserData(token) {
    try {
      console.log("🔍 Attempting to fetch user data from API...");
      console.log(
        "🔍 Using token:",
        token ? `${token.substring(0, 20)}...` : null
      );
      console.log("🔍 API_CONFIG available:", !!API_CONFIG);
      console.log("🔍 API_CONFIG.BASE_URL:", API_CONFIG?.BASE_URL);
      console.log(
        "🔍 API_CONFIG.ENDPOINTS.AUTH.ME:",
        API_CONFIG?.ENDPOINTS?.AUTH?.ME
      );

      // Fetch fresh user data from the BACKEND API
      const apiUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.ME);
      console.log("🔍 Full API URL:", apiUrl);

      const headers = API_CONFIG.getAuthHeaders(token);
      console.log("🔍 Request headers:", headers);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers,
      });

      console.log("🔍 API Response status:", response.status);
      console.log(
        "🔍 API Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const responseText = await response.text();
        console.log(
          "🔍 API Response text (first 200 chars):",
          responseText.substring(0, 200)
        );

        try {
          const userData = JSON.parse(responseText);
          console.log("🔍 Parsed user data:", userData);

          if (userData.success && userData.user) {
            console.log("🔍 Storing user data:", userData.user.email);
            await this.storeToken(token, userData.user);
            console.log(
              "✅ Fresh user data fetched and stored:",
              userData.user.email
            );
          } else {
            console.error("❌ Failed to get user data from API:", userData);
            // Fallback to storing just the token
            await this.storeToken(token, null);
          }
        } catch (parseError) {
          console.error("❌ Failed to parse API response as JSON:", parseError);
          console.error("❌ Response was:", responseText);
          // Fallback to storing just the token
          await this.storeToken(token, null);
        }
      } else {
        console.error("❌ Failed to fetch user data, status:", response.status);
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText.substring(0, 200));
        // Fallback to storing just the token
        await this.storeToken(token, null);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      console.error("❌ Error details:", error.message, error.stack);
      // Fallback to storing just the token
      await this.storeToken(token, null);
    }
  }

  async storeToken(token, user) {
    try {
      console.log("🔍 Storing token and user data...");
      console.log("🔍 Token:", token ? `${token.substring(0, 20)}...` : null);
      console.log("🔍 User:", user ? { email: user.email, id: user.id } : null);

      // Always update the stored data when token changes
      const storageData = {
        jwtToken: token,
        userData: user,
        lastUpdated: Date.now(),
      };

      console.log("🔍 Storage data to save:", storageData);

      await chrome.storage.local.set(storageData);

      // Verify the data was stored
      const stored = await chrome.storage.local.get([
        "jwtToken",
        "userData",
        "lastUpdated",
      ]);
      console.log("✅ Data stored successfully:", {
        storedToken: stored.jwtToken
          ? `${stored.jwtToken.substring(0, 20)}...`
          : null,
        storedUser: stored.userData ? stored.userData.email : null,
        storedTimestamp: stored.lastUpdated
          ? new Date(stored.lastUpdated).toISOString()
          : null,
      });

      // Notify popup about token update (only if popup is open)
      try {
        chrome.runtime
          .sendMessage({ type: "TOKEN_UPDATED", token, user })
          .catch(() => {
            // Popup is not open, that's okay
          });
      } catch (error) {
        // Popup might not be open, that's okay
      }
    } catch (error) {
      console.error("❌ Error storing token and user data:", error);
      console.error("❌ Error details:", error.message, error.stack);
    }
  }

  async clearStoredToken() {
    await chrome.storage.local.remove(["jwtToken", "userData", "lastUpdated"]);
  }
}

// Initialize token sync
const tokenSync = new TokenSync();

// Handle extension installation
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    console.log("ProPulse extension installed!");
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getSettings") {
    chrome.storage.sync.get(["enabled"], function (result) {
      sendResponse({ success: true, data: result });
    });
    return true;
  }

  if (request.action === "updateSettings") {
    chrome.storage.sync.set(request.settings, function () {
      sendResponse({ success: true });
    });
    return true;
  }
});
