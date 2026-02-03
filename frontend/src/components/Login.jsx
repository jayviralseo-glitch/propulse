import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    clearError();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg-hero flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-60 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-60 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full opacity-40 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 mb-3 animate-slide-up">
          Welcome back
        </h2>
        <p
          className="text-center text-lg text-gray-600 mb-8 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Sign in to your account or{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div
        className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="glass-card py-12 px-8 shadow-large border-0 sm:rounded-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900 mb-3"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-2xl border-0 py-4 px-5 text-gray-900 bg-white shadow-soft ring-1 ring-inset transition-all duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white sm:text-sm sm:leading-6 ${
                    errors.email
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-gray-200 hover:ring-blue-200 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-3 text-sm text-red-600 font-medium animate-fade-in">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold leading-6 text-gray-900 mb-3"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-2xl border-0 py-4 px-5 text-gray-900 bg-white shadow-soft ring-1 ring-inset transition-all duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white sm:text-sm sm:leading-6 ${
                    errors.password
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-gray-200 hover:ring-blue-200 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-3 text-sm text-red-600 font-medium animate-fade-in">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 animate-fade-in">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-red-800">
                      Sign in failed
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-modern flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-large hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in to your account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  New to Propulse AI?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="flex w-full justify-center rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 shadow-soft hover:bg-gray-50 hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-medium"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
