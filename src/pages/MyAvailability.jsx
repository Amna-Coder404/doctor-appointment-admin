
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    CalendarOff,
    Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useMyAvailability from "../hooks/useMyAvailability";
import { formatDateTime, formatStatus, formatTime, DAYS } from "../utils/utils";

import "../styles/MyAvailability.css";

export default function MyAvailability({ profile }) {
    const navigate = useNavigate();

    const {
        doctor,
        schedules,
        unavailable,
        schedule,
        setSchedule,
        leave,
        setLeave,
        editingId,
        startEditing,
        cancelEditing,
        loading,
        savingSchedule,
        savingLeave,
        deletingId,
        error,
        success,
        loadData,
        handleSaveSchedule,
        handleSaveLeave,
        handleDelete,
    } = useMyAvailability(profile?.id);

    return (
        <div className="dashboard-main my-availability-main">
            <header className="dashboard-header my-availability-header">
                <div className="my-availability-heading">
                    <p className="eyebrow">DOCTOR WORKSPACE</p>
                    <h1>My Availability</h1>
                    <p className="muted">
                        Manage your weekly working hours and time off.
                    </p>
                </div>

                <button
                    type="button"
                    className="refresh-button my-availability-refresh"
                    onClick={loadData}
                    disabled={loading}
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "my-availability-spinning" : ""}
                    />
                    Refresh
                </button>
            </header>

            {doctor && (
                <section className="management-card my-availability-profile">
                    <div className="my-availability-profile-icon">
                        <Stethoscope size={22} />
                    </div>

                    <div>
                        <h3>{doctor.full_name}</h3>
                        <p className="muted">{doctor.specialization}</p>
                    </div>
                </section>
            )}

            {error && (
                <div className="error-message my-availability-message" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message my-availability-message" role="status">
                    {success}
                </div>
            )}

            {loading ? (
                <section className="management-card my-availability-loading">
                    <RefreshCw size={22} className="my-availability-spinning" />
                    <p>Loading your availability...</p>
                </section>
            ) : (
                <div className="my-availability-sections">
                    {/* Weekly working hours */}
                    <section className="management-card availability-card my-availability-card">
                        <div className="my-availability-section-heading">
                            <div className="my-availability-section-icon">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <h2>Weekly working hours</h2>
                                <p className="muted">
                                    Set your working days and appointment durations.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSaveSchedule}
                            className="availability-form my-availability-form"
                        >
                            <label>
                                Working day
                                <select
                                    required
                                    value={schedule.day_of_week}
                                    onChange={(e) =>
                                        setSchedule({
                                            ...schedule,
                                            day_of_week: e.target.value,
                                        })
                                    }
                                >
                                    {DAYS.map((day) => (
                                        <option key={day.value} value={day.value}>
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Start time
                                <input
                                    type="time"
                                    required
                                    value={schedule.start_time}
                                    onChange={(e) =>
                                        setSchedule({
                                            ...schedule,
                                            start_time: e.target.value,
                                        })
                                    }
                                />
                            </label>

                            <label>
                                End time
                                <input
                                    type="time"
                                    required
                                    value={schedule.end_time}
                                    onChange={(e) =>
                                        setSchedule({
                                            ...schedule,
                                            end_time: e.target.value,
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Appointment duration
                                <select
                                    required
                                    value={schedule.slot_duration_minutes}
                                    onChange={(e) =>
                                        setSchedule({
                                            ...schedule,
                                            slot_duration_minutes: e.target.value,
                                        })
                                    }
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </label>

                            <div className="availability-form-actions my-availability-form-actions">
                                <button
                                    type="submit"
                                    className="complete-button"
                                    disabled={savingSchedule}
                                >
                                    {editingId ? (
                                        <Pencil size={16} />
                                    ) : (
                                        <Plus size={16} />
                                    )}

                                    {savingSchedule
                                        ? "Saving..."
                                        : editingId
                                            ? "Update schedule"
                                            : "Add schedule"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="refresh-button"
                                        onClick={cancelEditing}
                                        disabled={savingSchedule}
                                    >
                                        Cancel edit
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="availability-list my-availability-list">
                            <div className="my-availability-list-heading">
                                <h3>Your schedule</h3>
                                <span className="my-availability-count">
                                    {schedules.length}
                                </span>
                            </div>

                            {schedules.length === 0 ? (
                                <div className="my-availability-empty">
                                    <CalendarDays size={26} />
                                    <strong>No working hours yet</strong>
                                    <p>
                                        Add your first weekly schedule using the form above.
                                    </p>
                                </div>
                            ) : (
                                schedules.map((item) => (
                                    <div
                                        className="availability-item my-availability-item"
                                        key={item.id}
                                    >
                                        <div className="my-availability-item-details">
                                            <strong>
                                                {DAYS.find(
                                                    (day) =>
                                                        Number(day.value) ===
                                                        Number(item.day_of_week)
                                                )?.label || "Day"}
                                            </strong>

                                            <p className="muted">
                                                {formatTime(item.start_time)}
                                                {" – "}
                                                {formatTime(item.end_time)}
                                            </p>

                                            <span className="my-availability-slot">
                                                {item.slot_duration_minutes}-minute appointments
                                            </span>

                                            {!item.is_active && (
                                                <span className="my-availability-inactive">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>

                                        <div className="appointment-actions my-availability-actions">
                                            <button
                                                type="button"
                                                className="refresh-button"
                                                onClick={() => startEditing(item)}
                                                disabled={savingSchedule}
                                            >
                                                <Pencil size={15} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="cancel-button"
                                                disabled={deletingId === item.id}
                                                onClick={() =>
                                                    handleDelete(
                                                        "doctor_availability",
                                                        item.id,
                                                        "schedule"
                                                    )
                                                }
                                            >
                                                <Trash2 size={15} />
                                                {deletingId === item.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Unavailable periods */}
                    <section className="management-card availability-card my-availability-card">
                        <div className="my-availability-section-heading">
                            <div className="my-availability-section-icon my-availability-leave-icon">
                                <CalendarOff size={21} />
                            </div>

                            <div>
                                <h2>Time off</h2>
                                <p className="muted">
                                    Add dates when patients should not book appointments.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSaveLeave}
                            className="availability-form my-availability-form"
                        >
                            <label>
                                Starts at
                                <input
                                    type="datetime-local"
                                    required
                                    value={leave.starts_at}
                                    onChange={(e) =>
                                        setLeave({
                                            ...leave,
                                            starts_at: e.target.value,
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Ends at
                                <input
                                    type="datetime-local"
                                    required
                                    value={leave.ends_at}
                                    onChange={(e) =>
                                        setLeave({
                                            ...leave,
                                            ends_at: e.target.value,
                                        })
                                    }
                                />
                            </label>

                            <label className="availability-reason my-availability-reason">
                                Reason <span>(optional)</span>
                                <input
                                    type="text"
                                    maxLength={200}
                                    placeholder="e.g. Leave or conference"
                                    value={leave.reason}
                                    onChange={(e) =>
                                        setLeave({
                                            ...leave,
                                            reason: e.target.value,
                                        })
                                    }
                                />
                            </label>

                            <div className="availability-form-actions my-availability-form-actions">
                                <button
                                    type="submit"
                                    className="complete-button"
                                    disabled={savingLeave}
                                >
                                    <Plus size={16} />
                                    {savingLeave
                                        ? "Saving..."
                                        : "Add unavailable period"}
                                </button>
                            </div>
                        </form>

                        <div className="availability-list my-availability-list">
                            <div className="my-availability-list-heading">
                                <h3>Scheduled time off</h3>
                                <span className="my-availability-count">
                                    {unavailable.length}
                                </span>
                            </div>

                            {unavailable.length === 0 ? (
                                <div className="my-availability-empty">
                                    <CalendarOff size={26} />
                                    <strong>No time off scheduled</strong>
                                    <p>
                                        Your unavailable dates will appear here.
                                    </p>
                                </div>
                            ) : (
                                unavailable.map((item) => (
                                    <div
                                        className="availability-item my-availability-item"
                                        key={item.id}
                                    >
                                        <div className="my-availability-item-details">
                                            <strong>
                                                {item.reason || "Unavailable"}
                                            </strong>

                                            <p className="muted">
                                                {formatDateTime(item.starts_at)}
                                            </p>

                                            <p className="muted">
                                                Until {formatDateTime(item.ends_at)}
                                            </p>
                                        </div>

                                        <div className="appointment-actions my-availability-actions">
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                disabled={deletingId === item.id}
                                                onClick={() =>
                                                    handleDelete(
                                                        "doctor_unavailability",
                                                        item.id,
                                                        "unavailable period"
                                                    )
                                                }
                                            >
                                                <Trash2 size={15} />
                                                {deletingId === item.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            )}

        </div>
    );
}
