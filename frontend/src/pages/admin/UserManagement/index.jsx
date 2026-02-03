import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import UserList from "./components/UserList";
import UserStats from "./components/UserStats";
import { adminGetUsers } from "../../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single API call to fetch all users data
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all users with a single API call
        const result = await adminGetUsers({ limit: 1000 });

        if (result.success) {
          setUsers(result.data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Calculate stats from the fetched users data
  const calculateStats = () => {
    if (!users.length) return null;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(
        (user) => user.currentPlan && user.planStatus === "active"
      ).length,
      adminUsers: users.filter((user) => user.role === "admin").length,
      newUsersThisMonth: users.filter(
        (user) => new Date(user.createdAt) >= thisMonth
      ).length,
      premiumUsers: users.filter(
        (user) => user.currentPlan && user.planStatus === "active"
      ).length,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader
          title="User Management"
          description="Manage users, roles, and subscriptions"
          icon={Users}
          showBackButton={true}
          backLink="/admin"
          iconBgColor="from-blue-500 to-blue-600"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader
          title="User Management"
          description="Manage users, roles, and subscriptions"
          icon={Users}
          showBackButton={true}
          backLink="/admin"
          iconBgColor="from-blue-500 to-blue-600"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 mb-2">Failed to load users</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="User Management"
        description="Manage users, roles, and subscriptions"
        icon={Users}
        showBackButton={true}
        backLink="/admin"
        iconBgColor="from-blue-500 to-blue-600"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Statistics - Pass pre-calculated stats */}
        <UserStats stats={stats} />

        {/* User List - Pass users data and refresh function */}
        <div className="mt-8">
          <UserList
            users={users}
            onUsersUpdate={(updatedUsers) => setUsers(updatedUsers)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
