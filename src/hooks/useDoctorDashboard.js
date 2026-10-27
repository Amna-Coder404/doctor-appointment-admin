import { useEffect, useState } from "react";
import {
    updateMyDoctorProfile,
    uploadDoctorImage,
} from "../services/doctorService";

export function useDoctorDashboard({ doctor, profile, onUpdated }) {
    const [originalForm, setOriginalForm] = useState(null);
    const [originalImage, setOriginalImage] = useState("");

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        specialization: "",
        qualification: "",
        bio: "",
        clinic_name: "",
        clinic_address: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!doctor) return;

        const initialForm = {
            full_name: doctor.full_name || "",
            phone: doctor.phone || "",
            specialization: doctor.specialization || "",
            qualification: doctor.qualification || "",
            bio: doctor.bio || "",
            clinic_name: doctor.clinic_name || "",
            clinic_address: doctor.clinic_address || "",
        };

        const initialImage = doctor.profile_image_url || "";

        setForm(initialForm);
        setOriginalForm(initialForm);
        setPreview(initialImage);
        setOriginalImage(initialImage);
        setImage(null);
        setError("");
        setSuccess("");
    }, [doctor]);

    useEffect(() => {
        if (!image) return;

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    function handleChange(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
        setSuccess("");
    }

    function handleCancel() {
        if (originalForm) {
            setForm({ ...originalForm });
        }

        setImage(null);
        setPreview(originalImage);
        setError("");
        setSuccess("");
    }

    async function handleSave(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            if (!profile?.id || doctor?.user_id !== profile.id) {
                throw new Error("Your doctor account could not be verified.");
            }

            const updates = { ...form };

            if (image) {
                updates.profile_image_url = await uploadDoctorImage(image);
            }

            const updatedDoctor = await updateMyDoctorProfile(
                profile.id,
                updates
            );

            setImage(null);
            setPreview(updatedDoctor?.profile_image_url || preview);
            setOriginalImage(updatedDoctor?.profile_image_url || preview);
            setOriginalForm({ ...form });

            setSuccess("Your profile has been updated successfully.");

            await onUpdated?.(updatedDoctor);
        } catch (err) {
            setError(err.message || "Could not update your profile.");
        } finally {
            setSaving(false);
        }
    }

    return {
        form,
        image,
        preview,
        saving,
        error,
        success,
        setImage,
        setError,
        setSuccess,
        handleChange,
        handleCancel,
        handleSave,
    };
}