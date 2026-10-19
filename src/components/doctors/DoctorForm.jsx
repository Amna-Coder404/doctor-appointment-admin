
import { useEffect, useState } from "react";
import { ImagePlus, UserRound, X } from "lucide-react";

const fields = [
    { name: "full_name", label: "Full name", required: true },
    { name: "specialization", label: "Specialization", required: true },
    { name: "qualification", label: "Qualification" },
    {
        name: "experience_years",
        label: "Experience (years)",
        type: "number",
        required: true,
    },
    {
        name: "consultation_fee",
        label: "Consultation fee",
        type: "number",
        required: true,
    },
    { name: "phone", label: "Phone" },
    { name: "email", label: "Email", type: "email" },
    { name: "clinic_name", label: "Clinic name" },
    { name: "clinic_address", label: "Clinic address" },
];

export default function DoctorForm({
    initialForm,
    saving,
    formError,
    onSave,
    onCancel,
}) {
    const [form, setForm] = useState(initialForm);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        initialForm.profile_image_url || ""
    );

    useEffect(() => {
        setForm(initialForm);
        setFile(null);
        setPreview(initialForm.profile_image_url || "");
    }, [initialForm]);

    useEffect(() => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleImageChange(event) {
        const selected = event.target.files?.[0];
        if (!selected) return;

        if (!selected.type.startsWith("image/")) {
            alert("Please select an image file.");
            event.target.value = "";
            return;
        }

        if (selected.size > 5 * 1024 * 1024) {
            alert("Image size must be 5 MB or less.");
            event.target.value = "";
            return;
        }

        setFile(selected);
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSave(event, form, file);
    }

    return (
        <form className="doctor-form" onSubmit={handleSubmit}>
            <div className="doctor-image-picker">
                <div className="doctor-image-preview">
                    {preview ? (
                        <img src={preview} alt="Doctor preview" />
                    ) : (
                        <UserRound size={34} />
                    )}
                </div>

                <div className="doctor-image-controls">
                    <label className="doctor-upload-btn">
                        <ImagePlus size={17} />
                        Choose photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>

                    <span>Image files up to 5 MB</span>

                    {file && (
                        <button
                            type="button"
                            className="doctor-remove-image"
                            onClick={() => {
                                setFile(null);
                                setPreview(form.profile_image_url || "");
                            }}
                        >
                            <X size={14} /> Remove selection
                        </button>
                    )}
                </div>
            </div>

            <div className="doctor-form-grid">
                {fields.map((field) => (
                    <label className="doctor-field" key={field.name}>
                        <span>{field.label}</span>
                        <input
                            name={field.name}
                            type={field.type || "text"}
                            value={form[field.name] ?? ""}
                            onChange={handleChange}
                            required={field.required}
                            min={
                                field.type === "number" ? 0 : undefined
                            }
                            step={
                                field.name === "consultation_fee" ? "0.01" : field.name === "experience_years" ? "1" :
                                    undefined
                            }
                        />
                    </label>
                ))}

                <label className="doctor-field doctor-field-full">
                    <span>Biography</span>
                    <textarea
                        name="bio"
                        value={form.bio ?? ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Short introduction about the doctor"
                    />
                </label>
            </div>

            {formError && (
                <p className="doctor-form-error">{formError}</p>
            )}

            <div className="doctor-form-actions">
                <button
                    type="button"
                    className="doctor-btn doctor-btn-secondary"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="doctor-btn doctor-btn-primary"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Doctor"}
                </button>
            </div>
        </form>
    );
}
