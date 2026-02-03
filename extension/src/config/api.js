export const API_CONFIG = {
  // Environment detection - use local backend for development
  getBaseUrl: () => {
    // Use local backend for now
    // TODO: Update this to production URL when deploying
    return "http://localhost:3000";
  },

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      ME: "/api/auth/me",
    },
    PROFILES: {
      LIST: "/api/profiles",
      CREATE: "/api/profiles",
    },
    TEMPLATES: {
      LIST: "/api/templates",
    },
    PROPOSALS: {
      GENERATE: "/api/proposals/generate",
    },
  },

  buildUrl: (endpoint) => `${API_CONFIG.getBaseUrl()}${endpoint}`,

  getAuthHeaders: (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }),

  // Helper function to check if we're in development
  isDevelopment: () => API_CONFIG.getBaseUrl().includes("localhost"),

  // Helper function to get environment info
  getEnvironment: () => ({
    baseUrl: API_CONFIG.getBaseUrl(),
    isDev: API_CONFIG.isDevelopment(),
  }),
};

export default API_CONFIG;
