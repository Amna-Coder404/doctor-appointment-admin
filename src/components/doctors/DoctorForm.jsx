import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FileInput,
    Grid,
    Group,
    Stack,
    Text,
    TextInput,
    Textarea,
    Avatar,
} from "@mantine/core";
import { ImagePlus, Save, UserRound } from "lucide-react";

const fields = [
    { name: "full_name", label: "Full name", required: true },
    { name: "specialization", label: "Specialization", required: true },
    { name: "qualification", label: "Qualification" },
    { name: "experience_years", label: "Experience (years)", type: "number", required: true },
    { name: "consultation_fee", label: "Consultation fee (PKR)", type: "number", required: true },
    { name: "phone", label: "Phone number" },
    { name: "email", label: "Email address", type: "email" },
    { name: "clinic_name", label: "Clinic name" },
    { name: "clinic_address", label: "Clinic address" },
];

export default function DoctorForm({ initialForm, saving, formError, onSave, onCancel }) {
    const [form, setForm] = useState(initialForm);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(initialForm.profile_image_url || "");
    const [imageError, setImageError] = useState("");

    useEffect(() => {
        setForm(initialForm);
        setFile(null);
        setPreview(initialForm.profile_image_url || "");
        setImageError("");
    }, [initialForm]);

    useEffect(() => {
        if (!file) return undefined;
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    function updateField(name, value) {
        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleFileChange(selected) {
        setImageError("");
        if (!selected) {
            setFile(null);
            setPreview(form.profile_image_url || "");
            return;
        }
        if (!selected.type.startsWith("image/")) {
            setImageError("Please choose an image file.");
            return;
        }
        if (selected.size > 5 * 1024 * 1024) {
            setImageError("Image size must be 5 MB or less.");
            return;
        }
        setFile(selected);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (imageError) return;
        onSave(event, form, file);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="lg">
                <Group gap="md">
                    <Avatar src={preview || null} size={64} radius="lg" color="teal">
                        <UserRound size={27} />
                    </Avatar>
                    <Stack gap={4}>
                        <Text fw={600} size="sm">Doctor profile photo</Text>
                        <Text size="xs" c="dimmed">PNG, JPG or WebP. Maximum 5 MB.</Text>
                    </Stack>
                </Group>

                <FileInput
                    label="Upload photo"
                    placeholder="Select a profile image"
                    leftSection={<ImagePlus size={16} />}
                    accept="image/png,image/jpeg,image/webp"
                    value={file}
                    onChange={handleFileChange}
                    clearable
                />

                {imageError && <Alert color="red">{imageError}</Alert>}

                <Grid>
                    {fields.map((field) => (
                        <Grid.Col key={field.name} span={{ base: 12, sm: 6 }}>
                            <TextInput
                                label={field.label}
                                type={field.type || "text"}
                                value={form[field.name] ?? ""}
                                onChange={(event) => updateField(field.name, event.currentTarget.value)}
                                required={field.required}
                                min={field.type === "number" ? 0 : undefined}
                                step={field.name === "consultation_fee" ? "0.01" : field.name === "experience_years" ? "1" : undefined}
                            />
                        </Grid.Col>
                    ))}
                    <Grid.Col span={12}>
                        <Textarea
                            label="Professional biography"
                            placeholder="Short introduction about the doctor"
                            value={form.bio ?? ""}
                            onChange={(event) => updateField("bio", event.currentTarget.value)}
                            minRows={3}
                            autosize
                        />
                    </Grid.Col>
                </Grid>

                {formError && <Alert color="red" title="Unable to save doctor">{formError}</Alert>}

                <Group justify="flex-end">
                    <Button variant="default" onClick={onCancel} disabled={saving}>Cancel</Button>
                    <Button type="submit" color="teal" loading={saving} leftSection={<Save size={16} />}>
                        Save doctor
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
