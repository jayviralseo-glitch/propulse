import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardHeader() {
  const { currentUser, backendUser } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {backendUser?.name || currentUser?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
