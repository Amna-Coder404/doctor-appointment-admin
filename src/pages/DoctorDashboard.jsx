
import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Button,
    FileInput,
    Grid,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import {
    CheckCircle2,
    ImagePlus,
    UserRound,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import {
    updateMyDoctorProfile,
    uploadDoctorImage,
} from "../services/doctorService";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function DoctorProfileSettings({ doctor, onUpdated }) {
    const { profile } = useAuth();

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        specialization: "",
        qualification: "",
        bio: "",
        clinic_name: "",
        clinic_address: "",
    });

    const [originalForm, setOriginalForm] = useState(null);
    const [originalImage, setOriginalImage] = useState("");
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
                throw new Error(
                    "Your doctor account could not be verified."
                );
            }

            const updates = { ...form };

            if (image) {
                updates.profile_image_url =
                    await uploadDoctorImage(image);
            }

            const updatedDoctor = await updateMyDoctorProfile(
                profile.id,
                updates
            );

            setImage(null);
            setSuccess(
                "Your profile has been updated successfully."
            );

            await onUpdated?.(updatedDoctor);
        } catch (err) {
            setError(
                err.message || "Could not update your profile."
            );
        } finally {
            setSaving(false);
        }
    }

    if (!doctor) {
        return <Text>Loading doctor profile...</Text>;
    }
    return (
        <Stack gap="xl">
            <div>
                <Title order={2}>My Profile</Title>
                <Text c="dimmed" size="sm" mt={4}>
                    Manage your professional information and account
                    security.
                </Text>
            </div>

            {error && (
                <Alert color="red" title="Something went wrong">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    color="teal"
                    title="Success"
                    icon={<CheckCircle2 size={18} />}
                >
                    {success}
                </Alert>
            )}

            <Paper
                withBorder
                radius="lg"
                p={{ base: "md", sm: "xl" }}
            >
                <form onSubmit={handleSave}>
                    <Stack gap="lg">
                        <Group gap="md" align="center">
                            <Avatar
                                src={preview || null}
                                size={88}
                                radius="xl"
                                color="teal"
                            >
                                <UserRound size={36} />
                            </Avatar>

                            <Stack gap={4}>
                                <Title order={4}>
                                    Professional profile
                                </Title>
                                <Text c="dimmed" size="sm">
                                    This information helps patients
                                    identify you.
                                </Text>
                            </Stack>
                        </Group>

                        <FileInput
                            label="Profile image"
                            placeholder="Choose an image"
                            leftSection={<ImagePlus size={18} />}
                            accept="image/png,image/jpeg,image/webp"
                            value={image}
                            onChange={(file) => {
                                setImage(file);
                                setError("");
                                setSuccess("");
                            }}
                            clearable
                            description="PNG, JPG or WebP. Maximum 5 MB."
                        />

                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Full name"
                                    value={form.full_name}
                                    onChange={(event) =>
                                        handleChange(
                                            "full_name",
                                            event.currentTarget.value
                                        )
                                    }
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Phone number"
                                    placeholder="03XXXXXXXXX"
                                    value={form.phone}
                                    onChange={(event) =>
                                        handleChange(
                                            "phone",
                                            event.currentTarget.value
                                                .replace(/\D/g, "")
                                                .slice(0, 11)
                                        )
                                    }
                                    maxLength={11}
                                    inputMode="numeric"
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Specialization"
                                    value={form.specialization}
                                    onChange={(event) =>
                                        handleChange(
                                            "specialization",
                                            event.currentTarget.value
                                        )
                                    }
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Qualification"
                                    value={form.qualification}
                                    onChange={(event) =>
                                        handleChange(
                                            "qualification",
                                            event.currentTarget.value
                                        )
                                    }
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Textarea
                                    label="Professional bio"
                                    placeholder="Describe your experience and expertise"
                                    value={form.bio}
                                    onChange={(event) =>
                                        handleChange(
                                            "bio",
                                            event.currentTarget.value
                                        )
                                    }
                                    minRows={3}
                                    autosize
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Clinic name"
                                    value={form.clinic_name}
                                    onChange={(event) =>
                                        handleChange(
                                            "clinic_name",
                                            event.currentTarget.value
                                        )
                                    }
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Clinic address"
                                    value={form.clinic_address}
                                    onChange={(event) =>
                                        handleChange(
                                            "clinic_address",
                                            event.currentTarget.value
                                        )
                                    }
                                />
                            </Grid.Col>
                        </Grid>

                        <Group justify="flex-end" mt="md">
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                loading={saving}
                                color="teal"
                            >
                                Save changes
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>

            <ChangePasswordForm />
        </Stack>
    );
}
