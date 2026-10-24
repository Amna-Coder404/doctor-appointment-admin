
import { useCallback, useEffect, useState } from "react";
import {
    getDoctorProfile,
} from "../services/appointmentService";
import {
    fetchDoctorAvailability,
    fetchDoctorUnavailability,
    addDoctorSchedule,
    addDoctorUnavailability,
    deleteDoctorAvailability,
    updateDoctorSchedule,
} from "../services/doctorAvailabilityService";

export const INITIAL_SCHEDULE = {
    day_of_week: "1",
    start_time: "09:00",
    end_time: "17:00",
    slot_duration_minutes: "30",
};

export const INITIAL_LEAVE = {
    starts_at: "",
    ends_at: "",
    reason: "",
};

export default function useMyAvailability(userId) {
    const [doctor, setDoctor] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [unavailable, setUnavailable] = useState([]);

    const [schedule, setSchedule] = useState({ ...INITIAL_SCHEDULE });
    const [leave, setLeave] = useState({ ...INITIAL_LEAVE });
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [savingSchedule, setSavingSchedule] = useState(false);
    const [savingLeave, setSavingLeave] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const doctorData = await getDoctorProfile(userId);

            if (!doctorData) {
                throw new Error("Your doctor profile could not be found.");
            }

            const [scheduleData, unavailableData] = await Promise.all([
                fetchDoctorAvailability(doctorData.id),
                fetchDoctorUnavailability(doctorData.id),
            ]);

            setDoctor(doctorData);
            setSchedules(scheduleData);
            setUnavailable(unavailableData);
        } catch (err) {
            setError(err.message || "Unable to load your availability.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function startEditing(item) {
        setEditingId(item.id);
        setSchedule({
            day_of_week: String(item.day_of_week),
            start_time: item.start_time.slice(0, 5),
            end_time: item.end_time.slice(0, 5),
            slot_duration_minutes: String(item.slot_duration_minutes),
        });
        setError("");
        setSuccess("");
    }

    function cancelEditing() {
        setEditingId(null);
        setSchedule({ ...INITIAL_SCHEDULE });
    }

    async function handleSaveSchedule(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!doctor) {
            setError("Your doctor profile is not available.");
            return;
        }

        if (schedule.end_time <= schedule.start_time) {
            setError("End time must be later than start time.");
            return;
        }

        const duration = Number(schedule.slot_duration_minutes);

        if (!Number.isInteger(duration) || duration <= 0) {
            setError("Slot duration must be a positive whole number.");
            return;
        }

        setSavingSchedule(true);

        try {
            if (editingId) {
                await updateDoctorSchedule(editingId, doctor.id, schedule);
                setSuccess("Schedule updated successfully.");
            } else {
                await addDoctorSchedule(doctor.id, schedule);
                setSuccess("Schedule added successfully.");
            }

            cancelEditing();
            await loadData();
        } catch (err) {
            setError(
                err.code === "23505"
                    ? "This schedule already exists."
                    : err.message || "Unable to save the schedule."
            );
        } finally {
            setSavingSchedule(false);
        }
    }

    async function handleSaveLeave(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!doctor) {
            setError("Your doctor profile is not available.");
            return;
        }

        const start = new Date(leave.starts_at);
        const end = new Date(leave.ends_at);

        if (
            !leave.starts_at ||
            !leave.ends_at ||
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            setError("Enter a valid start and end date/time.");
            return;
        }

        if (end <= start) {
            setError("End date/time must be after start date/time.");
            return;
        }

        setSavingLeave(true);

        try {
            await addDoctorUnavailability(doctor.id, leave);
            setLeave({ ...INITIAL_LEAVE });
            setSuccess("Unavailable period added successfully.");
            await loadData();
        } catch (err) {
            setError(err.message || "Unable to add unavailable period.");
        } finally {
            setSavingLeave(false);
        }
    }

    async function handleDelete(table, id, label) {
        if (!doctor) return;

        if (!window.confirm(`Delete this ${label}?`)) return;

        setError("");
        setSuccess("");
        setDeletingId(id);

        try {
            await deleteDoctorAvailability(table, id, doctor.id);
            setSuccess(`${label} deleted successfully.`);
            await loadData();
        } catch (err) {
            setError(err.message || `Unable to delete ${label}.`);
        } finally {
            setDeletingId(null);
        }
    }

    return {
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
        setError,
        setSuccess,
        loadData,
        handleSaveSchedule,
        handleSaveLeave,
        handleDelete,
    };
}
