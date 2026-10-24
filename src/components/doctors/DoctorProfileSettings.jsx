
import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Button,
    Divider,
    FileInput,
    Grid,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import {
    CheckCircle2,
    LockKeyhole,
    ImagePlus,
    UserRound,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import {
    updateMyDoctorProfile,
    uploadDoctorImage,
} from "../../services/doctorService";

export default function DoctorProfileSettings({ doctor, onUpdated }) {
    const { profile, changePassword } = useAuth();
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
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
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

        setForm(initialForm);
        setOriginalForm(initialForm);

        setPreview(doctor.profile_image_url || "");
        setOriginalImage(doctor.profile_image_url || "");

        setImage(null);
    }, [doctor]);
    useEffect(() => {
        if (!image) return;

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
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
            setSuccess("Your profile has been updated successfully.");
            await onUpdated?.(updatedDoctor);
        } catch (err) {
            setError(err.message || "Could not update your profile.");
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordChange(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setPasswordSaving(true);

        try {
            await changePassword(password);
            setPassword("");
            setConfirmPassword("");
            setSuccess("Your password has been changed successfully.");
        } catch (err) {
            setError(err.message || "Could not change your password.");
        } finally {
            setPasswordSaving(false);
        }
    }

    if (!doctor) return <Text>Loading doctor profile...</Text>;

    return (
        <Stack gap="xl">
            <div>
                <Title order={2}>My Profile</Title>
                <Text c="dimmed" size="sm" mt={4}>
                    Manage your professional information and account security.
                </Text>
            </div>

            {error && (
                <Alert color="red" title="Something went wrong">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert color="teal" title="Success" icon={<CheckCircle2 size={18} />}>
                    {success}
                </Alert>
            )}

            <Paper withBorder radius="lg" p={{ base: "md", sm: "xl" }}>
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
                                <Title order={4}>Professional profile</Title>
                                <Text c="dimmed" size="sm">
                                    This information helps patients identify you.
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
                                    onChange={(e) => handleChange("full_name", e.currentTarget.value)}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Phone number"
                                    value={form.phone}
                                    onChange={(e) => handleChange("phone", e.currentTarget.value)}
                                    maxLength={11}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Specialization"
                                    value={form.specialization}
                                    onChange={(e) => handleChange("specialization", e.currentTarget.value)}
                                    required
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Qualification"
                                    value={form.qualification}
                                    onChange={(e) => handleChange("qualification", e.currentTarget.value)}
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Textarea
                                    label="Professional bio"
                                    placeholder="Describe your experience and expertise"
                                    value={form.bio}
                                    onChange={(e) => handleChange("bio", e.currentTarget.value)}
                                    minRows={3}
                                    autosize
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Clinic name"
                                    value={form.clinic_name}
                                    onChange={(e) => handleChange("clinic_name", e.currentTarget.value)}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Clinic address"
                                    value={form.clinic_address}
                                    onChange={(e) => handleChange("clinic_address", e.currentTarget.value)}
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

            <Paper withBorder radius="lg" p={{ base: "md", sm: "xl" }}>
                <Group gap="sm" mb="xs">
                    <LockKeyhole size={22} />
                    <Title order={3}>Change password</Title>
                </Group>

                <Text c="dimmed" size="sm" mb="lg">
                    Choose a strong password with at least 8 characters.
                </Text>

                <Divider mb="lg" />

                <form onSubmit={handlePasswordChange}>
                    <Stack gap="md">
                        <PasswordInput
                            label="New password"
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            minLength={8}
                            required
                        />

                        <PasswordInput
                            label="Confirm new password"
                            placeholder="Re-enter new password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                            minLength={8}
                            required
                        />

                        <Group justify="flex-end">
                            <Button
                                type="submit"
                                loading={passwordSaving}
                                color="teal"
                            >
                                Update password
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Stack>
    );
}
