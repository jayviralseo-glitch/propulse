import axios from "axios";


const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

if (!backendBaseUrl) {
  console.error("VITE_BACKEND_BASE_URL environment variable is not set!");
  console.error("Please set VITE_BACKEND_BASE_URL in your .env file");
}

// Create axios instance with default config
const api = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API request failed:", error);

    if (error.response) {
      // Server responded with error status
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);

      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
);

// Simple auth functions
export const login = async (email, password) => {
  try {
    const result = await api.post("/api/auth/login", { email, password });

    if (result.success) {
      localStorage.setItem("token", result.token);
      return { success: true, user: result.user };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const register = async (name, email, password, phoneNumber) => {
  try {
    const result = await api.post("/api/auth/register", {
      name,
      email,
      password,
      phoneNumber,
    });
    if (result.success) {
      localStorage.setItem("token", result.token);
      return { success: true, user: result.user };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  return { success: true };
};

export const getCurrentUser = async () => {
  try {
    const result = await api.get("/api/auth/me");
    if (result.success) {
      return { success: true, user: result.user };
    } else {
      return { success: false, user: null };
    }
  } catch (error) {
    return { success: false, user: null };
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Analytics functions
export const getAnalytics = async (period = "7d") => {
  try {
    const result = await api.get(`/api/history/analytics?period=${period}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin API functions
export const adminGetUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const result = await api.get(`/api/admin/users?${queryString}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetUser = async (userId) => {
  try {
    const result = await api.get(`/api/admin/users/${userId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminUpdateUserRole = async (userId, role) => {
  try {
    const result = await api.patch(`/api/admin/users/${userId}/role`, { role });
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminUpdateUserSubscription = async (userId, subscriptionData) => {
  try {
    const result = await api.patch(
      `/api/admin/users/${userId}/subscription`,
      subscriptionData
    );
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminDeleteUser = async (userId) => {
  try {
    const result = await api.delete(`/api/admin/users/${userId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetUserAnalytics = async (userId, period = "30d") => {
  try {
    const result = await api.get(
      `/api/admin/users/${userId}/analytics?period=${period}`
    );
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin Pricing Management
export const adminGetPricingPlans = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const result = await api.get(`/api/admin/pricing?${queryString}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetPricingPlan = async (planId) => {
  try {
    const result = await api.get(`/api/admin/pricing/${planId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminCreatePricingPlan = async (planData) => {
  try {
    const result = await api.post("/api/admin/pricing", planData);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminUpdatePricingPlan = async (planId, planData) => {
  try {
    const result = await api.put(`/api/admin/pricing/${planId}`, planData);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminDeletePricingPlan = async (planId) => {
  try {
    const result = await api.delete(`/api/admin/pricing/${planId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminTogglePricingPlan = async (planId) => {
  try {
    const result = await api.patch(`/api/admin/pricing/${planId}/toggle`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminUpdatePricingPlanOrder = async (planId, order) => {
  try {
    const result = await api.patch(`/api/admin/pricing/${planId}/order`, {
      order,
    });
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin Proposal Stats
export const adminGetProposalStats = async (period = "30d") => {
  try {
    const result = await api.get(`/api/admin/proposals/stats?period=${period}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetProposals = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const result = await api.get(`/api/admin/proposals?${queryString}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetProposal = async (proposalId) => {
  try {
    const result = await api.get(`/api/admin/proposals/${proposalId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetUserProposals = async (userId, period = "30d") => {
  try {
    const result = await api.get(
      `/api/admin/proposals/user/${userId}?period=${period}`
    );
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetProfileProposals = async (profileId, period = "30d") => {
  try {
    const result = await api.get(
      `/api/admin/proposals/profile/${profileId}?period=${period}`
    );
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminDeleteProposal = async (proposalId) => {
  try {
    const result = await api.delete(`/api/admin/proposals/${proposalId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin Payment Management
export const adminGetPayments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const result = await api.get(`/api/admin/payments?${queryString}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetPaymentStats = async (period = "30d") => {
  try {
    const result = await api.get(`/api/admin/payments/stats?period=${period}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetPayment = async (paymentId) => {
  try {
    const result = await api.get(`/api/admin/payments/${paymentId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminUpdatePaymentStatus = async (paymentId, statusData) => {
  try {
    const result = await api.patch(
      `/api/admin/payments/${paymentId}/status`,
      statusData
    );
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetUserPayments = async (userId, period = "30d") => {
  try {
    const result = await api.get(
      `/api/admin/payments/user/${userId}?period=${period}`
    );
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetFailedPayments = async () => {
  try {
    const result = await api.get("/api/admin/payments/failed/review");
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminRetryPayment = async (paymentId) => {
  try {
    const result = await api.post(`/api/admin/payments/${paymentId}/retry`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin Template Management
export const adminGetTemplates = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const result = await api.get(`/api/templates?${queryString}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminGetTemplate = async (templateId) => {
  try {
    const result = await api.get(`/api/templates/${templateId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminCreateTemplate = async (templateData) => {
  try {
    const result = await api.post("/api/templates", templateData);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminUpdateTemplate = async (templateId, templateData) => {
  try {
    const result = await api.put(`/api/templates/${templateId}`, templateData);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminDeleteTemplate = async (templateId) => {
  try {
    const result = await api.delete(`/api/templates/${templateId}`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const adminToggleTemplateStatus = async (templateId) => {
  try {
    const result = await api.patch(`/api/templates/${templateId}/toggle`);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default api;
