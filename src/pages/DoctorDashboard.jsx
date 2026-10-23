
import { useCallback, useEffect, useState } from 'react'
import {
    Activity,
    CalendarDays,
    Clock3,
    LogOut,
    Stethoscope,
    CheckCircle2,
    RefreshCw,
} from 'lucide-react'
import { supabase } from '../lib/supabase.jsx'

export default function DoctorDashboard({ profile }) {
    const [doctor, setDoctor] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [appointmentCount, setAppointmentCount] = useState(0)
    const [pendingCount, setPendingCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [completingId, setCompletingId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loadDoctorData = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const { data: doctorData, error: doctorError } = await supabase
                .from('doctors')
                .select('id, full_name, specialization, profile_image_url')
                .eq('user_id', profile.id)
                .maybeSingle()

            if (doctorError) throw doctorError

            if (!doctorData) {
                setDoctor(null)
                setError(
                    'Your login is not linked to a doctor profile yet. Please contact the administrator.'
                )
                return
            }

            setDoctor(doctorData)

            const [
                allAppointments,
                pendingAppointments,
                appointmentList,
            ] = await Promise.all([
                supabase
                    .from('appointments')
                    .select('id', { count: 'exact', head: true })
                    .eq('doctor_id', doctorData.id),

                supabase
                    .from('appointments')
                    .select('id', { count: 'exact', head: true })
                    .eq('doctor_id', doctorData.id)
                    .eq('status', 'pending'),

                supabase
                    .from('appointments')
                    .select('*')
                    .eq('doctor_id', doctorData.id)
                    .order('created_at', { ascending: false }),
            ])

            if (allAppointments.error) throw allAppointments.error
            if (pendingAppointments.error) throw pendingAppointments.error
            if (appointmentList.error) throw appointmentList.error

            setAppointmentCount(allAppointments.count ?? 0)
            setPendingCount(pendingAppointments.count ?? 0)
            setAppointments(appointmentList.data ?? [])
        } catch (err) {
            setError(err.message || 'Failed to load your dashboard.')
        } finally {
            setLoading(false)
        }
    }, [profile.id])

    useEffect(() => {
        loadDoctorData()
    }, [loadDoctorData])

    async function handleCompleteAppointment(appointmentId) {
        setError('')
        setSuccess('')
        setCompletingId(appointmentId)

        try {
            const { error: completeError } = await supabase.rpc(
                'doctor_complete_appointment',
                { p_appointment_id: appointmentId }
            )

            if (completeError) throw completeError

            setSuccess('Appointment marked as completed.')
            await loadDoctorData()
        } catch (err) {
            setError(err.message || 'Could not complete the appointment.')
        } finally {
            setCompletingId(null)
        }
    }

    async function logout() {
        await supabase.auth.signOut()
    }

    function formatDate(value) {
        if (!value) return 'Date not provided'

        return new Date(value).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
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

                <a className="sidebar-link" href="#my-appointments">
                    <CalendarDays size={18} /> My appointments
                </a>

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

                {success && (
                    <div className="success-message" role="status">
                        {success}
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
                        <div className="stat-icon">
                            <CalendarDays />
                        </div>
                        <p>My appointments</p>
                        <h3>{loading ? '—' : appointmentCount}</h3>
                        <span className="stat-caption">
                            Your booking records
                        </span>
                    </article>

                    <article className="stat-card">
                        <div className="stat-icon">
                            <Clock3 />
                        </div>
                        <p>Pending bookings</p>
                        <h3>{loading ? '—' : pendingCount}</h3>
                        <span className="stat-caption">
                            Awaiting review
                        </span>
                    </article>
                </section>

                <section
                    className="management-card doctor-info-card"
                    id="my-appointments"
                >
                    <div className="appointments-heading">
                        <div>
                            <h3>My appointments</h3>
                            <p className="muted">
                                View bookings assigned to your doctor profile.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="refresh-button"
                            onClick={loadDoctorData}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        <div className="appointments-list">
                            {appointments.map((appointment) => (
                                <article
                                    className="appointment-item"
                                    key={appointment.id}
                                >
                                    <div className="appointment-details">
                                        <strong>
                                            Appointment #{String(
                                                appointment.id
                                            ).slice(0, 8)}
                                        </strong>

                                        <span>
                                            {formatDate(
                                                appointment.appointment_date ||
                                                appointment.scheduled_at ||
                                                appointment.created_at
                                            )}
                                        </span>

                                        <span>
                                            Status:{' '}
                                            {appointment.status || 'Unknown'}
                                        </span>
                                    </div>

                                    {appointment.status === 'confirmed' && (
                                        <button
                                            type="button"
                                            className="complete-button"
                                            disabled={
                                                completingId !== null
                                            }
                                            onClick={() =>
                                                handleCompleteAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            <CheckCircle2 size={16} />
                                            {completingId === appointment.id
                                                ? 'Completing...'
                                                : 'Complete'}
                                        </button>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
