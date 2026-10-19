
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({
    session,
    profile,
    requiredRole,
    children,
}) {
    if (!session) {
        return <Navigate to="/login" replace />
    }

    if (!profile) {
        return (
            <div className="loading-screen">
                <p>Checking account permissions...</p>
            </div>
        )
    }

    if (profile.role !== requiredRole) {
        return (
            <Navigate
                to={
                    profile.role === 'admin'
                        ? '/admin/dashboard'
                        : profile.role === 'doctor'
                            ? '/doctor/dashboard'
                            : '/login'
                }
                replace
            />
        )
    }

    return children
}
