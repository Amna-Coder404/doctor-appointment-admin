
import { useState } from "react";
import {
    Activity,
    CalendarDays,
    Clock,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function DoctorLayout({ profile }) {
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const doctor = profile?.doctor;



    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = async () => {
        closeSidebar();
        await logout();
    };

    return (
        <div className="dashboard-shell">
            <header className="mobile-admin-header">
                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar"
                    aria-expanded={sidebarOpen}
                >
                    <Menu size={23} />
                </button>
                <span className="mobile-brand">MediBook Doctor</span>
            </header>

            {sidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                />
            )}

            <aside
                className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
            >
                <div className="sidebar-brand">
                    <div className="sidebar-brand-info">
                        <Activity size={25} />
                        <span>MediBook</span>
                    </div>

                    <button
                        type="button"
                        className="sidebar-close-btn"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    >
                        <X size={21} />
                    </button>
                </div>

                <p className="sidebar-label">DOCTOR WORKSPACE</p>

                <nav className="sidebar-navigation">
                    <NavLink
                        to="/doctor/dashboard"
                        end
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <Activity size={18} />
                        <span>Dashboard</span>
                    </NavLink>



                    <NavLink
                        to="/doctor/availability"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <Clock size={18} />
                        <span>My Availability</span>
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">

                    <div className="user-mini">
                        <div className="avatar">
                            {profile?.doctor?.profile_image_url ? (
                                <img
                                    src={profile.doctor.profile_image_url}
                                    alt={profile.doctor.full_name}
                                    className="avatar-image"
                                    onError={(e) => console.error("Doctor image failed to load:", e.currentTarget.src)}
                                />
                            ) : (
                                (profile?.doctor?.full_name || profile?.full_name || "D")
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <div className="user-mini-text">
                            <strong>
                                {doctor?.full_name || profile?.full_name || "Doctor"}
                            </strong>
                            <span>
                                {doctor?.specialization || "Doctor"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <div className="admin-page-content">
                <Outlet />
            </div>
        </div>
    );
}
