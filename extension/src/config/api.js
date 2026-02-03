export const API_CONFIG = {
  // Environment detection - use Render backend
  getBaseUrl: () => {
    // Use Render backend in production
    return "https://propulse-5kb7.onrender.com";
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
