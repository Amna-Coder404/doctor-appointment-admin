
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    getAppointments,
    updateAppointmentStatus,
} from "../services/appointmentService";

export default function useAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (err) {
            setError(err.message || "Could not load appointments.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    const changeStatus = async (appointment, status) => {
        setUpdatingId(appointment.id);
        setError("");
        setSuccess("");

        try {
            const allowedTransitions = {
                pending: ["confirmed", "cancelled"],
                confirmed: ["completed", "cancelled"],
                completed: [],
                cancelled: [],
            };

            if (!allowedTransitions[appointment.status]?.includes(status)) {
                throw new Error("This status change is not allowed.");
            }

            await updateAppointmentStatus(appointment.id, status);

            setAppointments((current) =>
                current.map((item) =>
                    item.id === appointment.id
                        ? { ...item, status }
                        : item
                )
            );

            setSuccess(`Appointment ${status} successfully.`);
        } catch (err) {
            setError(err.message || "Could not update appointment.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredAppointments = useMemo(() => {
        const term = search.trim().toLowerCase();

        return appointments.filter((appointment) => {
            const matchesStatus =
                statusFilter === "all" ||
                appointment.status === statusFilter;

            const matchesSearch = [
                appointment.patient?.full_name,
                appointment.patient?.email,
                appointment.doctor?.full_name,
            ].some((value) => value?.toLowerCase().includes(term));

            return matchesStatus && (!term || matchesSearch);
        });
    }, [appointments, statusFilter, search]);

    const stats = useMemo(
        () => ({
            total: appointments.length,
            pending: appointments.filter((a) => a.status === "pending").length,
            confirmed: appointments.filter((a) => a.status === "confirmed").length,
            completed: appointments.filter((a) => a.status === "completed").length,
            cancelled: appointments.filter((a) => a.status === "cancelled").length,
        }),
        [appointments]
    );

    return {
        appointments: filteredAppointments,
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
        refresh: loadAppointments,
    };
}
