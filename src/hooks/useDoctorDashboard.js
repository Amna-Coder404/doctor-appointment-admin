import { useEffect, useState } from "react";
import {
    updateMyDoctorProfile,
    uploadDoctorImage,
} from "../services/doctorService";

const emptyForm = {
    full_name: "",
    phone: "",
    specialization: "",
    qualification: "",
    bio: "",
    clinic_name: "",
    clinic_address: "",
};

export function useDoctorDashboard({ doctor, profile, onUpdated }) {
    const [form, setForm] = useState(emptyForm);
    const [originalForm, setOriginalForm] = useState(emptyForm);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [originalImage, setOriginalImage] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!doctor) return;

        const nextForm = {
            full_name: doctor.full_name || "",
            phone: doctor.phone || "",
            specialization: doctor.specialization || "",
            qualification: doctor.qualification || "",
            bio: doctor.bio || "",
            clinic_name: doctor.clinic_name || "",
            clinic_address: doctor.clinic_address || "",
        };
        const nextImage = doctor.profile_image_url || "";

        setForm(nextForm);
        setOriginalForm(nextForm);
        setImage(null);
        setOriginalImage(nextImage);
        setPreview(nextImage);
        setError("");
    }, [doctor]);

    useEffect(() => {
        if (!image) {
            setPreview(originalImage);
            return undefined;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [image, originalImage]);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
        setSuccess("");
    }

    function handleCancel() {
        setForm({ ...originalForm });
        setImage(null);
        setPreview(originalImage);
        setError("");
        setSuccess("");
    }

    async function handleSave(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!profile?.id || doctor?.user_id !== profile.id) {
            setError("Your doctor account could not be verified.");
            return;
        }

        setSaving(true);

        try {
            const updates = { ...form };

            if (image) {
                updates.profile_image_url = await uploadDoctorImage(image);
            }

            const updatedDoctor = await updateMyDoctorProfile(profile.id, updates);
            const savedImage = updatedDoctor?.profile_image_url || originalImage;

            setOriginalForm({ ...form });
            setOriginalImage(savedImage);
            setImage(null);
            setPreview(savedImage);
            setSuccess("Your professional profile has been updated.");

            await onUpdated?.(updatedDoctor);
        } catch (err) {
            setError(err?.message || "Could not update your profile.");
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
