
import { Navigate, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";

import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorsManagement from "./pages/DoctorsManagement";
import DoctorAvailability from "./pages/DoctorAvailability";
import MyAvailability from "./pages/MyAvailability";
import AppointmentManagement from "./pages/AppointmentManagement";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import DoctorLayout from "./components/DoctorLayout";

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

        {/* Admin routes share one layout and sidebar */}
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
            element={<AdminDashboard profile={profile} />}
          />
          <Route
            path="doctors"
            element={<DoctorsManagement />}
          />
          <Route
            path="appointments"
            element={<AppointmentManagement />}
          />
          <Route
            path="availability"
            element={<DoctorAvailability />}
          />
        </Route>

        {/* Doctor routes share one layout and sidebar */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              requiredRole="doctor"
            >
              <DoctorLayout profile={profile} />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<DoctorDashboard profile={profile} />}
          />
          <Route
            path="availability"
            element={<MyAvailability profile={profile} />}
          />
        </Route>

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/"
          element={<Navigate to={homePath} replace />}
        />

        <Route
          path="*"
          element={<Navigate to={homePath} replace />}
        />
      </Routes>
    </MantineProvider>
  );
}
