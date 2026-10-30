import { Activity, LockKeyhole, Mail, ShieldCheck, Stethoscope } from "lucide-react";
import {
    Alert,
    Box,
    Button,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
} from "@mantine/core";

import useLogin from "../hooks/useLogin";

export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        submitting,
        handleSubmit,
    } = useLogin();

    return (
        <Box
            mih="100vh"
            p={{ base: "md", sm: "xl" }}
            style={{
                display: "grid",
                placeItems: "center",
                background: "radial-gradient(circle at 15% 15%, rgba(20,184,166,.12), transparent 30%), linear-gradient(135deg, #f2f8f7, #f8fafc 55%, #edf6f5)",
            }}
        >
            <Paper
                withBorder
                radius="xl"
                shadow="xl"
                w="100%"
                maw={460}
                p={{ base: "lg", sm: 36 }}
            >
                <Stack gap="xl">
                    <Stack align="center" gap="sm">
                        <ThemeIcon size={58} radius="xl" color="teal">
                            <Activity size={30} />
                        </ThemeIcon>
                        <Stack gap={3} align="center">
                            <Title order={2} ta="center">MediBook</Title>
                            <Text size="xs" fw={700} c="teal" tt="uppercase" lts={1.2}>
                                Healthcare management
                            </Text>
                        </Stack>
                    </Stack>

                    <Stack gap={5}>
                        <Title order={3} ta="center">Welcome back</Title>
                        <Text size="sm" c="dimmed" ta="center">
                            Sign in to access your clinic workspace.
                        </Text>
                    </Stack>

                    {error && (
                        <Alert color="red" title="Sign-in failed" icon={<ShieldCheck size={17} />}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Email address"
                                placeholder="you@clinic.com"
                                type="email"
                                leftSection={<Mail size={17} />}
                                value={email}
                                onChange={(event) => setEmail(event.currentTarget.value)}
                                autoComplete="username"
                                required
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Enter your password"
                                leftSection={<LockKeyhole size={17} />}
                                value={password}
                                onChange={(event) => setPassword(event.currentTarget.value)}
                                autoComplete="current-password"
                                required
                            />
                            <Button type="submit" fullWidth size="md" loading={submitting} disabled={!email.trim() || !password}>
                                Sign in
                            </Button>
                        </Stack>
                    </form>

                    <Stack gap={7} align="center">
                        <Text size="xs" c="dimmed" ta="center">
                            Access is restricted to authorized administrators and doctors.
                        </Text>
                        <Text size="xs" c="dimmed">
                            <Stethoscope size={13} style={{ verticalAlign: "middle", marginRight: 5 }} />
                            Secure clinic workspace
                        </Text>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
