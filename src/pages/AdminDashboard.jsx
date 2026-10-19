
import { useEffect, useState } from "react";
import {
    Activity,
    CalendarDays,
    Stethoscope,
    Users,
    LogOut,
    ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.jsx";

export default function AdminDashboard({ profile }) {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        doctors: 0,
        appointments: 0,
        pending: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [doctors, appointments, pending] = await Promise.all([
                    supabase
                        .from("doctors")
                        .select("id", { count: "exact", head: true }),

                    supabase
                        .from("appointments")
                        .select("id", { count: "exact", head: true }),

                    supabase
                        .from("appointments")
                        .select("id", { count: "exact", head: true })
                        .eq("status", "pending"),
                ]);

                if (doctors.error) throw doctors.error;
                if (appointments.error) throw appointments.error;
                if (pending.error) throw pending.error;

                setStats({
                    doctors: doctors.count ?? 0,
                    appointments: appointments.count ?? 0,
                    pending: pending.count ?? 0,
                });
            } catch (error) {
                console.error("Failed to load dashboard stats:", error.message);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    async function logout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Sign out failed:", error.message);
            return;
        }

        navigate("/login");
    }

    return (
        <div className="dashboard-shell">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Activity size={25} />
                    <span>MediBook</span>
                </div>

                <p className="sidebar-label">WORKSPACE</p>

                <Link className="sidebar-link active" to="/admin/dashboard">
                    <Activity size={18} />
                    Dashboard
                </Link>

                <Link className="sidebar-link" to="/admin/doctors">
                    <Stethoscope size={18} />
                    Doctors
                </Link>

                <Link className="sidebar-link" to="/admin/appointments">
                    <CalendarDays size={18} />
                    Appointments
                </Link>

                <div className="sidebar-bottom">
                    <div className="user-mini">
                        <div className="avatar">
                            {(profile?.full_name || "A").charAt(0).toUpperCase()}
                        </div>

                        <div className="user-mini-text">
                            <strong>{profile?.full_name || "Administrator"}</strong>
                            <span>Administrator</span>
                        </div>
                    </div>

                    <button className="logout-button" onClick={logout}>
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <p className="eyebrow">OVERVIEW</p>
                        <h1>Admin dashboard</h1>
                        <p className="muted">
                            Here's what's happening at your clinic.
                        </p>
                    </div>

                    <div className="admin-chip">
                        <span className="online-dot" />
                        Admin access
                    </div>
                </header>

                <section className="welcome-banner">
                    <div>
                        <p>YOUR CLINIC WORKSPACE</p>
                        <h2>Welcome back, {profile?.full_name || "Admin"}.</h2>
                        <span>
                            Manage your doctors and appointments in one place.
                        </span>
                    </div>

                    <Activity size={54} strokeWidth={1.3} />
                </section>

                <section className="stats-grid">
                    <StatCard
                        title="Total doctors"
                        value={stats.doctors}
                        icon={<Stethoscope />}
                        loading={loading}
                    />

                    <StatCard
                        title="Total appointments"
                        value={stats.appointments}
                        icon={<CalendarDays />}
                        loading={loading}
                    />

                    <StatCard
                        title="Pending bookings"
                        value={stats.pending}
                        icon={<Users />}
                        loading={loading}
                    />
                </section>

                <section className="section-heading">
                    <div>
                        <h2>Management</h2>
                        <p className="muted">Choose what you want to manage.</p>
                    </div>
                </section>

                <section className="management-grid">
                    <ManagementCard
                        icon={<Stethoscope />}
                        title="Doctor management"
                        description="Update doctor profiles, consultation fees and status."
                        target="/admin/doctors"
                    />

                    <ManagementCard
                        icon={<CalendarDays />}
                        title="Appointments"
                        description="Review patient bookings and appointment statuses."
                        target="/admin/appointments"
                    />
                </section>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, loading }) {
    return (
        <article className="stat-card">
            <div className="stat-icon">{icon}</div>
            <p>{title}</p>
            <h3>{loading ? "—" : value}</h3>
            <span className="stat-caption">
                Live data from Supabase <ArrowUpRight size={14} />
            </span>
        </article>
    );
}

function ManagementCard({ icon, title, description, target }) {
    return (
        <Link to={target} className="management-card">
            <div className="management-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <span className="card-link">
                Open section <ArrowUpRight size={16} />
            </span>
        </Link>
    );
}
