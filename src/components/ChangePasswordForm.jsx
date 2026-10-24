
import { useState } from "react";
import {
    Alert,
    Button,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabase.jsx";

export default function ChangePasswordForm({
    mode = "change",
    onSuccess,
}) {
    const { changePassword } = useAuth();
    const isResetMode = mode === "reset";

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!isResetMode && !currentPassword) {
            setError("Please enter your current password.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            if (isResetMode) {
                const { error } = await supabase.auth.updateUser({
                    password,
                });

                if (error) throw error;
            } else {
                await changePassword(currentPassword, password);
            }

            setCurrentPassword("");
            setPassword("");
            setConfirmPassword("");

            setSuccess(
                isResetMode
                    ? "Password set successfully."
                    : "Your password has been changed successfully."
            );

            if (onSuccess) await onSuccess();
        } catch (err) {
            setError(err.message || "Could not update your password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Paper withBorder radius="lg" p={{ base: "md", sm: "xl" }}>
            <Group gap="sm" mb="xs">
                <LockKeyhole size={22} />
                <Title order={3}>
                    {isResetMode ? "Set your password" : "Change password"}
                </Title>
            </Group>

            <Text c="dimmed" size="sm" mb="lg">
                {isResetMode
                    ? "Create a password with at least 8 characters."
                    : "Verify your current password before choosing a new one."}
            </Text>

            {error && (
                <Alert color="red" title="Unable to update password" mb="md">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    color="teal"
                    title="Success"
                    icon={<CheckCircle2 size={18} />}
                    mb="md"
                >
                    {success}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    {!isResetMode && (
                        <PasswordInput
                            label="Current password"
                            placeholder="Enter your current password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(event) => {
                                setCurrentPassword(event.currentTarget.value);
                                setError("");
                                setSuccess("");
                            }}
                            required
                        />
                    )}

                    <PasswordInput
                        label="New password"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.currentTarget.value);
                            setError("");
                            setSuccess("");
                        }}
                        minLength={8}
                        required
                    />

                    <PasswordInput
                        label="Confirm password"
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => {
                            setConfirmPassword(event.currentTarget.value);
                            setError("");
                            setSuccess("");
                        }}
                        minLength={8}
                        required
                    />

                    <Group justify="flex-end">
                        <Button
                            type="submit"
                            color="teal"
                            loading={loading}
                            leftSection={<LockKeyhole size={16} />}
                        >
                            {isResetMode ? "Set password" : "Update password"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}
