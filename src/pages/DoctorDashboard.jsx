
import { useEffect, useState } from 'react'
import {
    Activity,
    CalendarDays,
    Clock3,
    LogOut,
    Stethoscope,
} from 'lucide-react'
import { supabase } from '../lib/supabase.jsx'

export default function DoctorDashboard({ profile }) {
    const [doctor, setDoctor] = useState(null)
    const [appointmentCount, setAppointmentCount] = useState(0)
    const [pendingCount, setPendingCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadDoctorData() {
            const { data: doctorData, error: doctorError } = await supabase
                .from('doctors')
                .select('id, full_name, specialization, profile_image_url')
                .eq('user_id', profile.id)
                .maybeSingle()

            if (doctorError) {
                setError(doctorError.message)
                setLoading(false)
                return
            }

            if (!doctorData) {
                setError(
                    'Your login is not linked to a doctor profile yet. Please contact the administrator.'
                )
                setLoading(false)
                return
            }

            setDoctor(doctorData)

            const [allAppointments, pendingAppointments] = await Promise.all([
                supabase
                    .from('appointments')
                    .select('id', { count: 'exact', head: true })
                    .eq('doctor_id', doctorData.id),
                supabase
                    .from('appointments')
                    .select('id', { count: 'exact', head: true })
                    .eq('doctor_id', doctorData.id)
                    .eq('status', 'pending'),
            ])

            if (allAppointments.error || pendingAppointments.error) {
                setError(
                    allAppointments.error?.message ||
                    pendingAppointments.error?.message
                )
            } else {
                setAppointmentCount(allAppointments.count ?? 0)
                setPendingCount(pendingAppointments.count ?? 0)
            }

            setLoading(false)
        }

        loadDoctorData()
    }, [profile.id])

    async function logout() {
        await supabase.auth.signOut()
    }

    return (
        <div className="dashboard-shell">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Activity size={25} />
                    <span>MediBook</span>
                </div>

                <p className="sidebar-label">DOCTOR WORKSPACE</p>
                <div className="sidebar-link active">
                    <Activity size={18} /> Dashboard
                </div>
                <div className="sidebar-link">
                    <CalendarDays size={18} /> My appointments
                </div>

                <div className="sidebar-bottom">
                    <div className="user-mini">
                        <div className="avatar">
                            {(profile.full_name || 'D').charAt(0).toUpperCase()}
                        </div>
                        <div className="user-mini-text">
                            <strong>{profile.full_name || 'Doctor'}</strong>
                            <span>Doctor account</span>
                        </div>
                    </div>

                    <button className="logout-button" onClick={logout}>
                        <LogOut size={18} /> Sign out
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <p className="eyebrow">DOCTOR WORKSPACE</p>
                        <h1>My dashboard</h1>
                        <p className="muted">
                            Welcome back, Dr. {profile.full_name || 'Doctor'}.
                        </p>
                    </div>
                    <div className="admin-chip">
                        <span className="online-dot" />
                        Doctor access
                    </div>
                </header>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                {doctor && (
                    <section className="welcome-banner doctor-banner">
                        <div>
                            <p>YOUR PROFILE</p>
                            <h2>{doctor.full_name}</h2>
                            <span>{doctor.specialization}</span>
                        </div>
                        <Stethoscope size={50} strokeWidth={1.3} />
                    </section>
                )}

                <section className="stats-grid">
                    <article className="stat-card">
                        <div className="stat-icon"><CalendarDays /></div>
                        <p>My appointments</p>
                        <h3>{loading ? '—' : appointmentCount}</h3>
                        <span className="stat-caption">Your booking records</span>
                    </article>

                    <article className="stat-card">
                        <div className="stat-icon"><Clock3 /></div>
                        <p>Pending bookings</p>
                        <h3>{loading ? '—' : pendingCount}</h3>
                        <span className="stat-caption">Awaiting review</span>
                    </article>
                </section>

                <section className="management-card doctor-info-card">
                    <h3>My workspace</h3>
                    <p>
                        Your appointment list and schedule management will be added here.
                        You will only be able to access appointments assigned to your
                        linked doctor profile.
                    </p>
                </section>
            </main>
        </div>
    )
}
