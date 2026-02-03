import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError } = useAuth();
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
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
      const result = await register(formData.email, formData.password, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      });

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg-hero flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-60 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-100 to-green-100 rounded-full opacity-60 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-full opacity-40 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 mb-3 animate-slide-up">
          Create your account
        </h2>
        <p
          className="text-center text-lg text-gray-600 mb-8 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Or{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div
        className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="glass-card py-12 px-8 shadow-large border-0 sm:rounded-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold leading-6 text-gray-900 mb-3"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-2xl border-0 py-4 px-5 text-gray-900 bg-white shadow-soft ring-1 ring-inset transition-all duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white sm:text-sm sm:leading-6 ${
                    errors.name
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-gray-200 hover:ring-blue-200 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-3 text-sm text-red-600 font-medium animate-fade-in">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>

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
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-3 text-sm text-red-600 font-medium animate-fade-in">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold leading-6 text-gray-900 mb-3"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full rounded-2xl border-0 py-4 px-5 text-gray-900 bg-white shadow-soft ring-1 ring-inset transition-all duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white sm:text-sm sm:leading-6 ${
                    errors.phoneNumber
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-gray-200 hover:ring-blue-200 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-3 text-sm text-red-600 font-medium animate-fade-in">
                    {errors.phoneNumber}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-2xl border-0 py-4 px-5 text-gray-900 bg-white shadow-soft ring-1 ring-inset transition-all duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:bg-white sm:text-sm sm:leading-6 ${
                    errors.password
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-gray-200 hover:ring-blue-200 focus:ring-blue-500"
                  }`}
                  placeholder="Create a password"
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
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Registration failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
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
                className="btn-modern flex w-full justify-center rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-large hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="flex w-full justify-center rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 shadow-soft hover:bg-gray-50 hover:border-blue-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
