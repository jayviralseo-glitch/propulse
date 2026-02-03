import React from "react";
import { User } from "lucide-react";

export default function BasicInformation({ profile, onInputChange }) {
  return (
    <div className="card-modern hover-lift bg-gradient-to-br from-white to-blue-50/30 rounded-xl sm:rounded-2xl border border-white/30 backdrop-blur-sm shadow-medium">
      <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-medium">
            <User className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
          </div>
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
            Basic Information
          </h2>
        </div>
      </div>
      <div className="p-2 sm:p-3 lg:p-4 space-y-2.5 sm:space-y-3 lg:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
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
              className="w-full border-2 border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 text-sm focus:border-blue-500 focus:ring-500/20 transition-all duration-300"
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
