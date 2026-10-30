import {
    Alert,
    Avatar,
    Button,
    Divider,
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
import { CheckCircle2, ImagePlus, Save, UserRound } from "lucide-react";

import { useDoctorDashboard } from "../../hooks/useDoctorDashboard";
import ChangePasswordForm from "../ChangePasswordForm";

export default function DoctorProfileSettings({ doctor, profile, onUpdated }) {
    const {
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
    } = useDoctorDashboard({ doctor, profile, onUpdated });

    const handleImageChange = (file) => {
        setError("");
        setSuccess("");

        if (file && file.size > 5 * 1024 * 1024) {
            setError("Image size must not exceed 5 MB.");
            return;
        }

        setImage(file);
    };

    if (!doctor) {
        return <Alert color="teal" title="Loading profile">Your professional profile is being loaded.</Alert>;
    }

    return (
        <Stack gap="lg">
            {error && <Alert color="red" title="Unable to save changes">{error}</Alert>}
            {success && (
                <Alert color="teal" icon={<CheckCircle2 size={18} />} title="Profile updated">
                    {success}
                </Alert>
            )}

            <Paper withBorder p={{ base: "md", sm: "xl" }} radius="lg">
                <form onSubmit={handleSave}>
                    <Stack gap="lg">
                        <Group gap="md">
                            <Avatar src={preview || null} size={72} radius="xl" color="teal">
                                <UserRound size={30} />
                            </Avatar>
                            <BoxText />
                        </Group>

                        <FileInput
                            label="Profile photo"
                            placeholder="Choose an image"
                            leftSection={<ImagePlus size={17} />}
                            accept="image/png,image/jpeg,image/webp"
                            value={image}
                            onChange={handleImageChange}
                            clearable
                            description="PNG, JPG or WebP. Maximum 5 MB."
                        />

                        <Divider />
                        <Title order={5}>Personal information</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput label="Full name" value={form.full_name} onChange={(event) => handleChange("full_name", event.currentTarget.value)} required />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput
                                    label="Phone number"
                                    placeholder="03XXXXXXXXX"
                                    value={form.phone}
                                    onChange={(event) => handleChange("phone", event.currentTarget.value.replace(/\D/g, "").slice(0, 11))}
                                    maxLength={11}
                                    inputMode="numeric"
                                />
                            </Grid.Col>
                        </Grid>

                        <Divider />
                        <Title order={5}>Professional information</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput label="Specialization" value={form.specialization} onChange={(event) => handleChange("specialization", event.currentTarget.value)} required />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput label="Qualification" value={form.qualification} onChange={(event) => handleChange("qualification", event.currentTarget.value)} />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea label="Professional bio" placeholder="Describe your experience and expertise..." value={form.bio} onChange={(event) => handleChange("bio", event.currentTarget.value)} minRows={3} autosize />
                            </Grid.Col>
                        </Grid>

                        <Divider />
                        <Title order={5}>Clinic information</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput label="Clinic name" value={form.clinic_name} onChange={(event) => handleChange("clinic_name", event.currentTarget.value)} />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInput label="Clinic address" value={form.clinic_address} onChange={(event) => handleChange("clinic_address", event.currentTarget.value)} />
                            </Grid.Col>
                        </Grid>

                        <Group justify="flex-end">
                            <Button variant="default" onClick={handleCancel} disabled={saving}>Discard changes</Button>
                            <Button type="submit" color="teal" loading={saving} leftSection={<Save size={16} />}>Save profile</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>

            <ChangePasswordForm />
        </Stack>
    );
}

function BoxText() {
    return (
        <Stack gap={3}>
            <Title order={4}>Professional profile</Title>
            <Text size="sm" c="dimmed">Your profile details help patients identify you.</Text>
        </Stack>
    );
}
