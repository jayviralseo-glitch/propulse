import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

const Header = () => {
  const { currentUser, backendUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="glass-effect shadow-soft border-b border-white/20 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={closeMobileMenu}
            >
              <div className="relative mr-3 sm:mr-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    P
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-xl sm:rounded-2xl opacity-20 blur-lg"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ProPulse
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/dashboard">
              <Button
                variant={isActiveRoute("/dashboard") ? "default" : "ghost"}
                className={`rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActiveRoute("/dashboard")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium hover:shadow-large hover:scale-105 active:scale-95"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 hover:shadow-medium"
                }`}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/profiles">
              <Button
                variant={isActiveRoute("/profiles") ? "default" : "ghost"}
                className={`rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActiveRoute("/profiles")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium hover:shadow-large hover:scale-105 active:scale-95"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 hover:shadow-medium"
                }`}
              >
                Profiles
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant={isActiveRoute("/history") ? "default" : "ghost"}
                className={`rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActiveRoute("/history")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium hover:shadow-large hover:scale-105 active:scale-95"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 hover:shadow-medium"
                }`}
              >
                History
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                variant={isActiveRoute("/pricing") ? "default" : "ghost"}
                className={`rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                  isActiveRoute("/pricing")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium hover:shadow-large hover:scale-105 active:scale-95"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 hover:shadow-medium"
                }`}
              >
                Pricing
              </Button>
            </Link>

            {/* Admin Panel Link - Only for admin users */}
            {backendUser?.role === "admin" && (
              <Link to="/admin">
                <Button
                  variant={isActiveRoute("/admin") ? "default" : "ghost"}
                  className={`rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 ${
                    isActiveRoute("/admin")
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-medium hover:shadow-large hover:scale-105 active:scale-95"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 hover:shadow-medium"
                  }`}
                >
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>

          {/* Desktop User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                Welcome,{" "}
                {currentUser?.displayName ||
                  backendUser?.name?.split(" ")[0] ||
                  "User"}
              </p>
              {backendUser?.currentPlan &&
                backendUser?.planStatus === "active" && (
                  <p className="text-xs text-gray-500">
                    {backendUser.currentPlan}
                  </p>
                )}
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 hover:text-blue-700 rounded-2xl px-4 py-2 font-medium transition-all duration-300 hover:shadow-medium hover:scale-105 active:scale-95"
            >
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 border-t border-gray-200 bg-white shadow-xl transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-98 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
          }`}
        >
          <div className="px-6 py-4 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-gray-200 ${
                  isActiveRoute("/dashboard")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/profiles"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-gray-200 ${
                  isActiveRoute("/profiles")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                Profiles
              </Link>
              <Link
                to="/history"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-gray-200 ${
                  isActiveRoute("/history")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                History
              </Link>
              <Link
                to="/pricing"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-gray-200 ${
                  isActiveRoute("/pricing")
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                Pricing
              </Link>

              {/* Admin Panel Link - Only for admin users */}
              {backendUser?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-gray-200 ${
                    isActiveRoute("/admin")
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile User Info and Logout */}
            <div className="border-t border-gray-200 pt-4 mt-4 pb-4">
              <div className="px-4 py-3 bg-gray-50 rounded-xl mb-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {currentUser?.displayName ||
                        backendUser?.name?.split(" ")[0] ||
                        "User"}
                    </p>
                    {backendUser?.currentPlan &&
                      backendUser?.planStatus === "active" && (
                        <p className="text-xs text-gray-500">
                          {backendUser.currentPlan}
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                variant="outline"
                className="w-full border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 hover:text-blue-700 rounded-xl py-3 font-medium transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
