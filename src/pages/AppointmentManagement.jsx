
import useAppointments from "../hooks/useAppointments";
import "../styles/AppointmentManagement.css";
import { formatDate, formatTime } from "../utils/utils";

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AppointmentManagement({
    role = "admin",
    userId = null,
}) {
    const {
        appointments,
        stats,
        loading,
        updatingId,
        statusFilter,
        setStatusFilter,
        search,
        setSearch,
        error,
        success,
        changeStatus,
        refresh,
    } = useAppointments({ role, userId });

    const isDoctor = role === "doctor";

    return (
        <main className="appointments-page">
            <div className="appointments-heading">
                <div>
                    <p className="appointments-eyebrow">
                        {isDoctor ? "DOCTOR WORKSPACE" : "ADMIN WORKSPACE"}
                    </p>

                    <h1>Appointments</h1>

                    <p className="appointments-subtitle">
                        {isDoctor
                            ? "View and manage your patient appointments."
                            : "View and manage patient bookings."}
                    </p>
                </div>

                <button
                    className="appointment-refresh"
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            <div className="appointment-stats">
                <div className="appointment-stat">
                    <span>Total appointments</span>
                    <strong>{stats.total}</strong>
                </div>

                <div className="appointment-stat pending-stat">
                    <span>Pending</span>
                    <strong>{stats.pending}</strong>
                </div>

                <div className="appointment-stat confirmed-stat">
                    <span>Confirmed</span>
                    <strong>{stats.confirmed}</strong>
                </div>

                <div className="appointment-stat completed-stat">
                    <span>Completed</span>
                    <strong>{stats.completed}</strong>
                </div>
            </div>

            {error && (
                <div className="appointment-alert error">
                    {error}
                </div>
            )}

            {success && (
                <div className="appointment-alert success">
                    {success}
                </div>
            )}

            <section className="appointment-panel">
                <div className="appointment-panel-heading">
                    <div>
                        <h2>
                            {isDoctor ? "My appointments" : "All appointments"}
                        </h2>

                        <p>
                            {isDoctor
                                ? "Review patient bookings and update their status."
                                : "Search bookings and update their status."}
                        </p>
                    </div>

                    <span className="appointment-count">
                        {appointments.length} results
                    </span>
                </div>

                <div className="appointment-filters">
                    <input
                        type="search"
                        placeholder={
                            isDoctor
                                ? "Search patient..."
                                : "Search patient or doctor..."
                        }
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search appointments"
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        aria-label="Filter by appointment status"
                    >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? (
                    <div className="appointment-empty">
                        Loading appointments...
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="appointment-empty">
                        <h3>No appointments found</h3>
                        <p>Try another search or status filter.</p>
                    </div>
                ) : (
                    <div className="appointment-table-wrap">
                        <table className="appointment-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>

                                    {!isDoctor && <th>Doctor</th>}

                                    <th>Date &amp; time</th>
                                    <th>Fee</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>
                                            <strong>
                                                {appointment.patient?.full_name ||
                                                    "Unknown patient"}
                                            </strong>

                                            <small>
                                                {appointment.patient?.email ||
                                                    "No email"}
                                            </small>
                                        </td>

                                        {!isDoctor && (
                                            <td>
                                                <strong>
                                                    {appointment.doctor?.full_name ||
                                                        "Unknown doctor"}
                                                </strong>

                                                <small>
                                                    {appointment.doctor?.specialization ||
                                                        "—"}
                                                </small>
                                            </td>
                                        )}

                                        <td>
                                            <strong>
                                                {formatDate(appointment.starts_at)}
                                            </strong>

                                            <small>
                                                {formatTime(appointment.starts_at)}
                                                {" – "}
                                                {formatTime(appointment.ends_at)}
                                            </small>
                                        </td>

                                        <td>
                                            {Number(
                                                appointment.consultation_fee || 0
                                            ).toLocaleString(undefined, {
                                                style: "currency",
                                                currency: "PKR",
                                            })}
                                        </td>

                                        <td>
                                            <span
                                                className={`payment-badge ${appointment.payment_status}`}
                                            >
                                                {appointment.payment_status || "unknown"}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`appointment-status ${appointment.status}`}
                                            >
                                                {formatStatus(appointment.status)}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="appointment-actions">
                                                {appointment.status === "pending" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="action-confirm"
                                                            disabled={
                                                                updatingId === appointment.id
                                                            }
                                                            onClick={() =>
                                                                changeStatus(
                                                                    appointment,
                                                                    "confirmed"
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-cancel"
                                                            disabled={
                                                                updatingId === appointment.id
                                                            }
                                                            onClick={() =>
                                                                changeStatus(
                                                                    appointment,
                                                                    "cancelled"
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {appointment.status === "confirmed" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="action-confirm"
                                                            disabled={
                                                                updatingId === appointment.id
                                                            }
                                                            onClick={() =>
                                                                changeStatus(
                                                                    appointment,
                                                                    "completed"
                                                                )
                                                            }
                                                        >
                                                            Complete
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-cancel"
                                                            disabled={
                                                                updatingId === appointment.id
                                                            }
                                                            onClick={() =>
                                                                changeStatus(
                                                                    appointment,
                                                                    "cancelled"
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {["completed", "cancelled"].includes(
                                                    appointment.status
                                                ) && (
                                                        <span className="appointment-no-action">
                                                            No actions
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
