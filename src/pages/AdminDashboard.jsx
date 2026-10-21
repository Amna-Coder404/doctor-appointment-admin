
import {
    Activity,
    CalendarDays,
    Stethoscope,
    Users,
    ArrowUpRight,
    Clock,
} from "lucide-react";

import {
    Badge,
    Card,
    Skeleton,
    ThemeIcon,
} from "@mantine/core";

import { Link } from "react-router-dom";
import useAdminDashboard from "../hooks/useAdminDashboard";

export default function AdminDashboard({ profile }) {
    const {
        stats,
        loading,
        error,
        refreshStats,
    } = useAdminDashboard();

    return (
        <main className="dashboard-main">
            <header className="dashboard-header">
                <div>
                    <p className="eyebrow">OVERVIEW</p>
                    <h1>Admin dashboard</h1>
                    <p className="muted">
                        Here's what's happening at your clinic.
                    </p>
                </div>

                <Badge
                    className="admin-chip"
                    variant="light"
                    color="teal"
                    size="lg"
                    radius="xl"
                >
                    <span className="online-dot" />
                    Admin access
                </Badge>
            </header>

            {error && (
                <div role="alert" className="dashboard-error">
                    <p>{error}</p>
                    <button type="button" onClick={refreshStats}>
                        Try again
                    </button>
                </div>
            )}

            <section className="welcome-banner">
                <div>
                    <p>YOUR CLINIC WORKSPACE</p>
                    <h2>
                        Welcome back, {profile?.full_name || "Admin"}.
                    </h2>
                    <span>
                        Manage your doctors and appointments in one place.
                    </span>
                </div>

                <Activity size={54} strokeWidth={1.3} />
            </section>

            <section className="stats-grid">
                <StatCard
                    title="Total doctors"
                    value={stats?.doctors}
                    icon={<Stethoscope size={22} />}
                    loading={loading}
                />

                <StatCard
                    title="Total appointments"
                    value={stats?.appointments}
                    icon={<CalendarDays size={22} />}
                    loading={loading}
                />

                <StatCard
                    title="Pending bookings"
                    value={stats?.pending}
                    icon={<Users size={22} />}
                    loading={loading}
                />
            </section>

            <section className="section-heading">
                <div>
                    <h2>Management</h2>
                    <p className="muted">
                        Choose what you want to manage.
                    </p>
                </div>
            </section>

            <section className="management-grid">
                <ManagementCard
                    icon={<Stethoscope size={22} />}
                    title="Doctor management"
                    description="Update doctor profiles, consultation fees and status."
                    target="/admin/doctors"
                />

                <ManagementCard
                    icon={<CalendarDays size={22} />}
                    title="Appointments"
                    description="Review patient bookings and appointment statuses."
                    target="/admin/appointments"
                />

                <ManagementCard
                    icon={<Clock size={22} />}
                    title="Doctor availability"
                    description="Manage weekly working hours and unavailable periods."
                    target="/admin/doctor-availability"
                />
            </section>
        </main>
    );
}

function StatCard({ title, value, icon, loading }) {
    return (
        <Card
            className="stat-card"
            padding="lg"
            radius="lg"
            withBorder
        >
            <ThemeIcon
                className="stat-icon"
                size={46}
                radius="md"
                variant="light"
                color="violet"
            >
                {icon}
            </ThemeIcon>

            <p>{title}</p>

            {loading ? (
                <Skeleton height={32} width={70} />
            ) : (
                <h3>{value ?? 0}</h3>
            )}

            <span className="stat-caption">
                Live data from Supabase{" "}
                <ArrowUpRight size={14} />
            </span>
        </Card>
    );
}

function ManagementCard({ icon, title, description, target }) {
    return (
        <Card
            component={Link}
            to={target}
            className="management-card"
            padding="lg"
            radius="lg"
            withBorder
        >
            <ThemeIcon
                className="management-icon"
                size={46}
                radius="md"
                variant="light"
                color="violet"
            >
                {icon}
            </ThemeIcon>

            <h3>{title}</h3>
            <p>{description}</p>

            <span className="card-link">
                Open section <ArrowUpRight size={16} />
            </span>
        </Card>
    );
}
