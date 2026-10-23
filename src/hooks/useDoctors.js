
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getDoctors,
    createDoctorAccount,
    updateDoctor,
    updateDoctorStatus,
    uploadDoctorImage,
} from "../services/doctorService";

const emptyForm = {
    full_name: "",
    specialization: "",
    qualification: "",
    experience_years: "0",
    consultation_fee: "0",
    bio: "",
    profile_image_url: "",
    phone: "",
    email: "",
    clinic_name: "",
    clinic_address: "",
};

export default function useDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [editingDoctor, setEditingDoctor] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });

    // Load doctors from Supabase.
    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getDoctors();
            setDoctors(data);
        } catch (err) {
            setError(err.message || "Failed to load doctors.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    // Search and filter doctors by status.
    const filteredDoctors = useMemo(() => {
        const query = search.trim().toLowerCase();

        return doctors.filter((doctor) => {
            const matchesSearch = [
                doctor.full_name,
                doctor.specialization,
                doctor.email,
            ].some((value) =>
                value?.toLowerCase().includes(query)
            );

            const matchesFilter =
                filter === "all" ||
                (filter === "active" && doctor.is_active) ||
                (filter === "inactive" && !doctor.is_active);

            return matchesSearch && matchesFilter;
        });
    }, [doctors, search, filter]);

    // Open a blank form for a new doctor.
    function openAdd() {
        setEditingDoctor(null);
        setForm({ ...emptyForm });
        setFormError("");
        setError("");
        setFormOpen(true);
    }

    // Open the form with existing doctor details.
    function openEdit(doctor) {
        setEditingDoctor(doctor);

        setForm({
            ...emptyForm,
            ...doctor,
            experience_years: String(
                doctor.experience_years ?? 0
            ),
            consultation_fee: String(
                doctor.consultation_fee ?? 0
            ),
        });

        setFormError("");
        setError("");
        setFormOpen(true);
    }

    // Close the modal.
    function closeModal() {
        if (saving) return;

        setFormOpen(false);
        setEditingDoctor(null);
        setForm({ ...emptyForm });
        setFormError("");
    }

    // Create a real login account for a new doctor,
    // or update the profile of an existing doctor.
    async function handleSave(event, values, file) {
        event.preventDefault();

        if (saving) return;

        setFormError("");
        setError("");

        const name = values.full_name?.trim() ?? "";
        const specialization =
            values.specialization?.trim() ?? "";

        const email =
            values.email?.trim().toLowerCase() ?? "";

        const experienceText = String(
            values.experience_years ?? ""
        ).trim();

        const feeText = String(
            values.consultation_fee ?? ""
        ).trim();

        const experience = Number(experienceText);
        const fee = Number(feeText);

        if (!name || !specialization) {
            setFormError(
                "Doctor name and specialization are required."
            );
            return;
        }

        // New doctors need an email for the login invitation.
        if (!editingDoctor && !email) {
            setFormError(
                "Email is required to create a doctor login."
            );
            return;
        }

        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            setFormError(
                "Please enter a valid email address."
            );
            return;
        }

        if (
            experienceText === "" ||
            !Number.isInteger(experience) ||
            experience < 0
        ) {
            setFormError(
                "Experience must be a whole number, such as 8."
            );
            return;
        }

        if (
            feeText === "" ||
            !Number.isFinite(fee) ||
            fee < 0
        ) {
            setFormError(
                "Consultation fee must be a valid number, such as 2000."
            );
            return;
        }

        const doctorId = editingDoctor?.id;

        if (editingDoctor && !doctorId) {
            setFormError(
                "Doctor ID is missing. Close the form and select the doctor again."
            );
            return;
        }

        setSaving(true);

        try {
            // Preserve the existing image unless a new one is selected.
            let imageUrl = values.profile_image_url || null;

            if (file) {
                imageUrl = await uploadDoctorImage(file);
            }

            const doctorData = {
                full_name: name,
                specialization,
                qualification:
                    values.qualification?.trim() || null,
                experience_years: experience,
                consultation_fee: fee,
                bio: values.bio?.trim() || null,
                profile_image_url: imageUrl,
                phone: values.phone?.trim() || null,
                email: email || null,
                clinic_name:
                    values.clinic_name?.trim() || null,
                clinic_address:
                    values.clinic_address?.trim() || null,
            };

            let savedDoctor;

            if (doctorId) {
                // Editing does not create another Auth account.
                savedDoctor = await updateDoctor(
                    doctorId,
                    doctorData
                );

                setDoctors((current) =>
                    current.map((doctor) =>
                        doctor.id === savedDoctor.id
                            ? savedDoctor
                            : doctor
                    )
                );
            } else {
                // The Edge Function creates the Auth user,
                // doctor profile, linked doctor record, and invitation.
                savedDoctor = await createDoctorAccount(
                    doctorData
                );

                setDoctors((current) => [
                    savedDoctor,
                    ...current,
                ]);
            }

            setFormOpen(false);
            setEditingDoctor(null);
            setForm({ ...emptyForm });
            setFormError("");
        } catch (err) {
            console.error("Save doctor error:", err);

            setFormError(
                err.message || "Failed to save doctor."
            );
        } finally {
            setSaving(false);
        }
    }

    // Activate or deactivate a doctor without deleting the record.
    async function handleToggleStatus(doctor) {
        const action = doctor.is_active
            ? "deactivate"
            : "reactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${doctor.full_name}?`
        );

        if (!confirmed) return;

        setError("");

        try {
            const updatedDoctor = await updateDoctorStatus(
                doctor.id,
                !doctor.is_active
            );

            setDoctors((current) =>
                current.map((item) =>
                    item.id === updatedDoctor.id
                        ? updatedDoctor
                        : item
                )
            );
        } catch (err) {
            console.error("Doctor status error:", err);

            setError(
                err.message || "Failed to update doctor status."
            );
        }
    }

    return {
        doctors,
        filteredDoctors,
        loading,
        saving,
        error,
        formError,
        search,
        setSearch,
        filter,
        setFilter,
        editingDoctor,
        formOpen,
        form,
        fetchDoctors,
        openAdd,
        openEdit,
        closeModal,
        handleSave,
        handleToggleStatus,
    };
}
