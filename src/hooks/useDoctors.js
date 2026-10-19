
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getDoctors,
    addDoctor,
    updateDoctor,
    updateDoctorStatus,
    uploadDoctorImage
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

    // Load doctors from Supabase
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

    // Search and status filter
    const filteredDoctors = useMemo(() => {
        const query = search.trim().toLowerCase();

        return doctors.filter((doctor) => {
            const matchesSearch = [
                doctor.full_name,
                doctor.specialization,
                doctor.email,
            ].some((value) => value?.toLowerCase().includes(query));

            const matchesFilter =
                filter === "all" ||
                (filter === "active" && doctor.is_active) ||
                (filter === "inactive" && !doctor.is_active);

            return matchesSearch && matchesFilter;
        });
    }, [doctors, search, filter]);

    // Open an empty form
    function openAdd() {
        setEditingDoctor(null);
        setForm({ ...emptyForm });
        setFormError("");
        setError("");
        setFormOpen(true);
    }

    // Open the form with existing doctor details
    function openEdit(doctor) {
        setEditingDoctor(doctor);

        setForm({
            ...emptyForm,
            ...doctor,
            experience_years: String(doctor.experience_years ?? 0),
            consultation_fee: String(doctor.consultation_fee ?? 0),
        });

        setFormError("");
        setError("");
        setFormOpen(true);
    }

    // Close the modal
    function closeModal() {
        if (saving) return;

        setFormOpen(false);
        setEditingDoctor(null);
        setForm({ ...emptyForm });
        setFormError("");
    }

    // Save a new doctor or update an existing one
    async function handleSave(event, values, file) {
        event.preventDefault();
        setFormError("");
        setError("");

        // Read and validate submitted values
        const name = values.full_name?.trim() ?? "";
        const specialization = values.specialization?.trim() ?? "";

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

        setSaving(true);

        try {
            // Keep the existing photo unless a new one is selected
            let imageUrl = values.profile_image_url || null;

            if (file) {
                imageUrl = await uploadDoctorImage(file);
            }

            const doctorData = {
                full_name: name,
                specialization,
                qualification: values.qualification?.trim() || null,
                experience_years: experience,
                consultation_fee: fee,
                bio: values.bio?.trim() || null,
                profile_image_url: imageUrl,
                phone: values.phone?.trim() || null,
                email: values.email?.trim() || null,
                clinic_name: values.clinic_name?.trim() || null,
                clinic_address: values.clinic_address?.trim() || null,
            };


            let savedDoctor;

            const doctorId = editingDoctor?.id;

            if (editingDoctor && !doctorId) {
                console.error("Invalid doctor record:", editingDoctor);
                setFormError(
                    "Doctor ID is missing. Close the form and select the doctor again."
                );
                return;
            }

            if (doctorId) {
                savedDoctor = await updateDoctor(doctorId, doctorData);

                setDoctors((current) =>
                    current.map((doctor) =>
                        doctor.id === savedDoctor.id ? savedDoctor : doctor
                    )
                );
            } else {
                savedDoctor = await addDoctor(doctorData);

                setDoctors((current) => [savedDoctor, ...current]);
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

    // Activate or deactivate without deleting the doctor
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
