import React from "react";
import { User } from "lucide-react";

export default function BasicInformation({ profile, onInputChange }) {
  return (
    <div className="card-modern hover-lift bg-gradient-to-br from-white to-blue-50/30 rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-medium">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Basic Information
          </h2>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="profileName"
              className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
            >
              Profile Name *
            </label>
            <input
              id="profileName"
              type="text"
              value={profile?.profileName || ""}
              onChange={(e) => onInputChange("profileName", e.target.value)}
              placeholder="e.g., john_doe_dev"
              required
              className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="profession"
              className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
            >
              Profession *
            </label>
            <input
              id="profession"
              type="text"
              value={profile?.profession || ""}
              onChange={(e) => onInputChange("profession", e.target.value)}
              placeholder="e.g., Software Developer"
              required
              className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
            >
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={profile?.firstName || ""}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              placeholder="John"
              required
              className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              value={profile?.lastName || ""}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              placeholder="Doe"
              required
              className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="text-gray-700 font-semibold mb-2 sm:mb-3 block text-sm sm:text-base"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={profile?.description || ""}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Brief description of your professional background..."
            rows={4}
            required
            className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
          />
        </div>
      </div>
    </div>
  );
}