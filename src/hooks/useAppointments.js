
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getAppointments,
    getDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus,
    updateDoctorAppointmentStatus,
} from "../services/appointmentService";

export default function useAppointments({
    role = "admin",
    userId = null,
} = {}) {
    const isDoctor = role === "doctor";

    const [appointments, setAppointments] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadAppointments = useCallback(async () => {
        if (isDoctor && !userId) {
            setAppointments([]);
            setDoctor(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (isDoctor) {
                const doctorProfile = await getDoctorProfile(userId);

                setDoctor(doctorProfile);

                if (!doctorProfile) {
                    setAppointments([]);
                    throw new Error("Doctor profile not found.");
                }

                const data = await getDoctorAppointments(doctorProfile.id);
                setAppointments(data);
            } else {
                const data = await getAppointments();
                setAppointments(data);
            }
        } catch (err) {
            setError(err.message || "Could not load appointments.");
        } finally {
            setLoading(false);
        }
    }, [isDoctor, userId]);

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

            if (isDoctor) {
                await updateDoctorAppointmentStatus(appointment.id, status);
            } else {
                await updateAppointmentStatus(appointment.id, status);
            }

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

            const searchValues = [
                appointment.patient?.full_name,
                appointment.patient?.email,
                appointment.doctor?.full_name,
            ];

            const matchesSearch =
                !term ||
                searchValues.some((value) =>
                    value?.toLowerCase().includes(term)
                );

            return matchesStatus && matchesSearch;
        });
    }, [appointments, statusFilter, search]);

    const stats = useMemo(
        () => ({
            total: appointments.length,
            pending: appointments.filter(
                (appointment) => appointment.status === "pending"
            ).length,
            confirmed: appointments.filter(
                (appointment) => appointment.status === "confirmed"
            ).length,
            completed: appointments.filter(
                (appointment) => appointment.status === "completed"
            ).length,
            cancelled: appointments.filter(
                (appointment) => appointment.status === "cancelled"
            ).length,
        }),
        [appointments]
    );

    return {
        appointments: filteredAppointments,
        allAppointments: appointments,
        doctor,
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
