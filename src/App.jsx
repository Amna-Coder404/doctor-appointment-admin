
import { Navigate, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";

import useAuth from "./hooks/useAuth";
import DoctorAvailability from "./pages/DoctorAvailability";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorsManagement from "./pages/DoctorsManagement";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AppointmentManagement from "./pages/AppointmentManagement";
import ResetPassword from "./pages/ResetPassword";


export default function App() {
  const { session, profile, loading } = useAuth();
  const role = profile?.role;

  if (loading) {
    return (
      <MantineProvider>
        <div className="loading-screen">
          <div className="loader" />
          <p>Loading your workspace...</p>
        </div>
      </MantineProvider>
    );
  }

  const homePath = !session
    ? "/login"
    : role === "admin"
      ? "/admin/dashboard"
      : role === "doctor"
        ? "/doctor/dashboard"
        : "/login";

  return (
    <MantineProvider>
      <Routes>
        <Route
          path="/login"
          element={
            !session ? (
              <Login />
            ) : (
              <Navigate to={homePath} replace />
            )
          }
        />

        {/* Admin routes share one sidebar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              requiredRole="admin"
            >
              <AdminLayout profile={profile} />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <AdminDashboard profile={profile} />
            }
          />

          <Route
            path="doctors"
            element={<DoctorsManagement />}
          />

          {/* Add your appointments page here when available */}

          <Route
            path="appointments"
            element={<AppointmentManagement />}
          />

          <Route path="/admin/availability" element={
            <ProtectedRoute
              session={session}
              profile={profile}
              requiredRole="admin"
            >
              <DoctorAvailability />
            </ProtectedRoute>
          }
          />
        </Route>

        {/* Doctor routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              requiredRole="doctor"
            >
              <DoctorDashboard profile={profile} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={homePath} replace />}
        />

        <Route
          path="*"
          element={<Navigate to={homePath} replace />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </MantineProvider>
  );
}
