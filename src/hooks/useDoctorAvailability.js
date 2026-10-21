
import { useCallback, useEffect, useState } from "react";

import {
    fetchDoctors,
    fetchDoctorAvailability,
    fetchDoctorUnavailability,
    addDoctorSchedule,
    addDoctorUnavailability,
    deleteDoctorAvailability,
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


export default function useDoctorAvailability() {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [unavailable, setUnavailable] = useState([]);

    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    const [leave, setLeave] = useState(INITIAL_LEAVE);

    const [loading, setLoading] = useState(true);
    const [savingSchedule, setSavingSchedule] = useState(false);
    const [savingLeave, setSavingLeave] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadDoctors = useCallback(async () => {
        const data = await fetchDoctors();

        setDoctors(data);

        setDoctorId((current) => {
            if (current && data.some((doctor) => doctor.id === current)) {
                return current;
            }

            return data[0]?.id ?? null;
        });
    }, []);

    const loadDoctorData = useCallback(async () => {
        if (!doctorId) {
            setSchedules([]);
            setUnavailable([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [scheduleData, unavailableData] = await Promise.all([
                fetchDoctorAvailability(doctorId),
                fetchDoctorUnavailability(doctorId),
            ]);

            setSchedules(scheduleData);
            setUnavailable(unavailableData);
        } catch (err) {
            setError(err.message || "Unable to load doctor schedules.");
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        loadDoctors().catch((err) => {
            setError(err.message || "Unable to load doctors.");
            setLoading(false);
        });
    }, [loadDoctors]);

    useEffect(() => {
        loadDoctorData();
    }, [loadDoctorData]);

    const selectedDoctor = doctors.find(
        (doctor) => doctor.id === doctorId
    );

    async function handleAddSchedule(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!doctorId) {
            setError("Please select a doctor first.");
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
            await addDoctorSchedule(doctorId, schedule);

            setSchedule({ ...INITIAL_SCHEDULE });
            setSuccess("Weekly schedule added successfully.");

            await loadDoctorData();
        } catch (err) {
            setError(
                err.code === "23505"
                    ? "This exact schedule already exists."
                    : err.message || "Unable to save the schedule."
            );
        } finally {
            setSavingSchedule(false);
        }
    }

    async function handleAddUnavailable(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!doctorId) {
            setError("Please select a doctor first.");
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
            setError("Please enter a valid start and end date/time.");
            return;
        }

        if (end <= start) {
            setError("Unavailable end time must be after the start time.");
            return;
        }

        setSavingLeave(true);

        try {
            await addDoctorUnavailability(doctorId, leave);

            setLeave({ ...INITIAL_LEAVE });
            setSuccess("Unavailable period added successfully.");

            await loadDoctorData();
        } catch (err) {
            setError(err.message || "Unable to save unavailable period.");
        } finally {
            setSavingLeave(false);
        }
    }

    async function handleDelete(table, id, label) {
        const confirmed = window.confirm(
            `Delete this ${label}? This action cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingId(id);

        try {
            await deleteDoctorAvailability(table, id, doctorId);

            setSuccess(`${label} deleted successfully.`);
            await loadDoctorData();
        } catch (err) {
            setError(err.message || `Unable to delete ${label}.`);
        } finally {
            setDeletingId(null);
        }
    }

    return {
        doctors,
        doctorId,
        setDoctorId,
        selectedDoctor,
        schedules,
        unavailable,
        schedule,
        setSchedule,
        leave,
        setLeave,
        loading,
        savingSchedule,
        savingLeave,
        deletingId,
        error,
        success,
        setError,
        setSuccess,
        loadDoctorData,
        handleAddSchedule,
        handleAddUnavailable,
        handleDelete,
    };
}
