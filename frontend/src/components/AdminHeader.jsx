import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, LogOut, ArrowLeft } from "lucide-react";

const AdminHeader = ({
  title,
  description,
  icon: Icon,
  showBackButton = false,
  backLink = "/admin",
  iconBgColor = "from-blue-500 to-blue-600",
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Back button for sub-pages */}
            {showBackButton && (
              <Link
                to={backLink}
                className="flex items-center text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            )}

            {/* Icon and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {Icon ? (
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${iconBgColor} rounded-xl flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    A
                  </span>
                </div>
              )}

              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {title || "Admin Panel"}
                </h1>
                {description && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Navigation and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to App
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {/* Mobile Title */}
              <div className="px-2 py-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {title || "Admin Panel"}
                </h2>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>

              {/* Admin Navigation Links */}
              <div className="border-t border-gray-100 pt-3">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Admin Sections
                </h3>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Dashboard Overview
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  User Management
                </Link>
                <Link
                  to="/admin/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Pricing Plans
                </Link>
                <Link
                  to="/admin/templates"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Template Management
                </Link>
                <Link
                  to="/admin/proposals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Proposal Analytics
                </Link>
                <Link
                  to="/admin/payments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Payment Management
                </Link>
              </div>

              {/* App Navigation */}
              <div className="border-t border-gray-100 pt-3">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  App Navigation
                </h3>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                  Back to App
                </Link>
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-100 pt-3">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Account
                </h3>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-left"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
