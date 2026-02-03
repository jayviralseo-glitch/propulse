import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated,
} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (isAuthenticated()) {
      const result = await getCurrentUser();
      if (result.success) {
        setCurrentUser({ email: result.user.email, uid: result.user.id });
        setBackendUser(result.user);
      } else {
        // Token is invalid, remove it
        apiLogout();
        setCurrentUser(null);
        setBackendUser(null);
      }
    }
    setLoading(false);
  };

  const register = async (email, password, userData) => {
    try {
      setError(null);
      setLoading(true);

      const result = await apiRegister(
        userData.name,
        email,
        password,
        userData.phoneNumber
      );

      if (result.success) {
        setCurrentUser({ email, uid: result.user.id });
        setBackendUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const result = await apiLogin(email, password);

      if (result.success) {
        setCurrentUser({ email, uid: result.user.id });
        setBackendUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("AuthContext login error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await apiLogout();

      if (result.success) {
        setCurrentUser(null);
        setBackendUser(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    backendUser,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
