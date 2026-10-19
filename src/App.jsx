
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase.jsx";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorsManagement from "./pages/DoctorsManagement";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile(userId) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("id", userId)
          .single();

        if (!active) return;

        if (error) {
          console.error("Could not load profile:", error.message);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (error) {
        if (active) {
          console.error("Profile loading failed:", error.message);
          setProfile(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    async function initialize() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        console.error("Session loading failed:", error.message);
        setLoading(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;

      setSession(newSession);

      if (newSession?.user) {
        setLoading(true);

        // Load the profile after the auth callback completes.
        setTimeout(() => {
          if (active) {
            loadProfile(newSession.user.id);
          }
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>Loading your workspace...</p>
      </div>
    );
  }

  const role = profile?.role;

  return (
    <Routes>
      {/* Login */}
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
            <div className="access-denied">
              <p>Your account does not have web panel access.</p>

              <button
                onClick={() => supabase.auth.signOut()}
              >
                Sign out
              </button>
            </div>
          )
        }
      />

      {/* Admin Dashboard */}
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

      {/* Doctors Management */}
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

      {/* Doctor Dashboard */}
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

      {/* Default Route */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              !session
                ? "/login"
                : role === "admin"
                  ? "/admin/dashboard"
                  : role === "doctor"
                    ? "/doctor/dashboard"
                    : "/login"
            }
            replace
          />
        }
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              !session
                ? "/login"
                : role === "admin"
                  ? "/admin/dashboard"
                  : role === "doctor"
                    ? "/doctor/dashboard"
                    : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}
