
import { useState } from "react";
import {
    Activity,
    CalendarDays,
    Stethoscope,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminLayout({ profile }) {
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = async () => {
        closeSidebar();
        await logout();
    };

    return (
        <div className="dashboard-shell">
            {/* Mobile and tablet header */}
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

                <span className="mobile-brand">MediBook Admin</span>
            </header>

            {/* Overlay closes the sidebar when clicked */}
            {sidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
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

                <p className="sidebar-label">WORKSPACE</p>

                <nav className="sidebar-navigation">
                    <NavLink
                        to="/admin/dashboard"
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
                        to="/admin/doctors"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <Stethoscope size={18} />
                        <span>Doctors</span>
                    </NavLink>

                    <NavLink
                        to="/admin/appointments"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <CalendarDays size={18} />
                        <span>Appointments</span>
                    </NavLink>
                    <NavLink
                        to="/admin/availability"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <CalendarDays size={18} />
                        <span>Doctor Availability</span>
                    </NavLink>
                </nav>

                {/* Profile and logout */}
                <div className="sidebar-bottom">
                    <div className="user-mini">
                        <div className="avatar">
                            {(profile?.full_name || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="user-mini-text">
                            <strong>
                                {profile?.full_name || "Administrator"}
                            </strong>
                            <span>Administrator</span>
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

            {/* Current page renders here */}
            <div className="admin-page-content" key={location.pathname}>
                <Outlet />
            </div>
        </div>
    );
}
