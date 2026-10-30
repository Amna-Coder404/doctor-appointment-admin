import { Navigate, Route, Routes } from "react-router-dom";

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
import AdminLayout from "./components/layout/AdminLayout";
import DoctorLayout from "./components/layout/DoctorLayout";

import { Center, Loader, Stack, Text } from "@mantine/core";

export default function App() {
    const { session, profile, loading } = useAuth();

    const homePath = !session
        ? "/login"
        : profile?.role === "admin"
            ? "/admin/dashboard"
            : profile?.role === "doctor"
                ? "/doctor/dashboard"
                : "/login";

    if (loading) {
        return (
            <Center mih="100vh">
                <Stack align="center" gap="sm">
                    <Loader color="teal" size="lg" />
                    <Text size="sm" c="dimmed">Preparing your workspace...</Text>
                </Stack>
            </Center>
        );
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={session ? <Navigate to={homePath} replace /> : <Login />}
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute session={session} profile={profile} requiredRole="admin">
                        <AdminLayout profile={profile} />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard profile={profile} />} />
                <Route path="doctors" element={<DoctorsManagement />} />
                <Route path="appointments" element={<AppointmentManagement role="admin" />} />
                <Route path="availability" element={<DoctorAvailability />} />
            </Route>

            <Route
                path="/doctor"
                element={
                    <ProtectedRoute session={session} profile={profile} requiredRole="doctor">
                        <DoctorLayout profile={profile} />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<DoctorDashboard profile={profile} />} />
                <Route
                    path="appointments"
                    element={<AppointmentManagement role="doctor" userId={profile?.id} />}
                />
                <Route path="availability" element={<MyAvailability profile={profile} />} />
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to={homePath} replace />} />
            <Route path="*" element={<Navigate to={homePath} replace />} />
        </Routes>
    );
}
