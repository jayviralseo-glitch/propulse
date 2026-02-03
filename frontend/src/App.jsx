import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { Toaster } from "./components/ui/toaster";
import PageTransition from "./components/PageTransition";
import DashboardPage from "./pages/UserDashboard/Dashboard";
import History from "./pages/UserDashboard/History";
import ProfileEdit from "./pages/UserDashboard/ProfileEdit/index";
import ProfileCreate from "./pages/UserDashboard/ProfileCreate/index";
import Profiles from "./pages/UserDashboard/Profiles";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import LandingPage from "./pages/LandingPage";
import ContactUs from "./pages/ContactUs";

// Admin Pages
import AdminDashboard from "./pages/admin/index";
import UserManagement from "./pages/admin/UserManagement";
import PricingManagement from "./pages/admin/PricingManagement";
import TemplateManagement from "./pages/admin/TemplateManagement";
import TemplateEdit from "./pages/admin/TemplateManagement/TemplateEdit";
import ProposalStats from "./pages/admin/ProposalStats";
import PaymentManagement from "./pages/admin/PaymentManagement";
import UserDetails from "./pages/admin/UserDetails";

function App() {
  let authData = {
    currentUser: null,
    backendUser: null,
    loading: true,
    logout: () => {},
  };

  try {
    authData = useAuth();
  } catch (error) {
    console.error("AuthContext error:", error);
    // Return loading state while context is being established
    return (
      <div className="min-h-screen gradient-bg-hero flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium animate-pulse">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  const { currentUser, backendUser, loading, logout } = authData;

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg-hero flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-60 animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-60 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-large animate-scale-in">
              <span className="text-white text-4xl font-bold">P</span>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-3xl opacity-20 blur-xl"></div>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Profile Management Routes */}
          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Profiles />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles/:id/edit"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ProfileEdit />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles/new"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ProfileCreate />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <History />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Pricing Route - Public */}
          <Route path="/pricing" element={<Pricing />} />

          {/* Payment Success Route */}
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <PaymentSuccess />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Payment Cancel Route */}
          <Route
            path="/payment/cancel"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <PaymentCancel />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <PageTransition>
                  <UserManagement />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminRoute>
                <PageTransition>
                  <UserDetails />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pricing"
            element={
              <AdminRoute>
                <PageTransition>
                  <PricingManagement />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/templates"
            element={
              <AdminRoute>
                <PageTransition>
                  <TemplateManagement />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/templates/edit/:id"
            element={
              <AdminRoute>
                <PageTransition>
                  <TemplateEdit />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/proposals"
            element={
              <AdminRoute>
                <PageTransition>
                  <ProposalStats />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <PageTransition>
                  <PaymentManagement />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
