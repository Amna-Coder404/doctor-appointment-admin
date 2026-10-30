import { Center, Loader, Stack, Text } from "@mantine/core";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    session,
    profile,
    requiredRole,
    children,
}) {
    if (!session) return <Navigate to="/login" replace />;

    if (!profile) {
        return (
            <Center mih="100vh">
                <Stack align="center" gap="sm">
                    <Loader color="teal" />
                    <Text size="sm" c="dimmed">Checking account permissions...</Text>
                </Stack>
            </Center>
        );
    }

    if (profile.role !== requiredRole) {
        return (
            <Navigate
                to={profile.role === "admin" ? "/admin/dashboard" : profile.role === "doctor" ? "/doctor/dashboard" : "/login"}
                replace
            />
        );
    }

    return children;
}
