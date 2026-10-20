
import { Navigate, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";

import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorsManagement from "./pages/DoctorsManagement";
import ProtectedRoute from "./components/ProtectedRoute";

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

  const homePath = !session ? "/login"
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
            ) : role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : role === "doctor" ? (
              <Navigate to="/doctor/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              requiredRole="admin"
            >
              <AdminDashboard profile={profile} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute
              session={session}
              profile={profile}
              requiredRole="admin"
            >
              <DoctorsManagement />
            </ProtectedRoute>
          }
        />

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
      </Routes>
    </MantineProvider>
  );
}
