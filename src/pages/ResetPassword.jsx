import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    ArrowLeft,
    LockKeyhole,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";
import {
    Alert,
    Box,
    Button,
    Center,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";

import { supabase } from "../lib/supabase.jsx";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState("");
    const [sessionReady, setSessionReady] = useState(false);

    useEffect(() => {
        let active = true;

        async function verifyInvitation() {
            try {
                const params = new URLSearchParams(window.location.search);
                const tokenHash = params.get("token_hash");
                const type = params.get("type");

                if (tokenHash && (type === "invite" || type === "recovery")) {
                    const { error: verifyError } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type,
                    });
                    if (verifyError) throw verifyError;
                }

                const { data, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                if (!data.session) {
                    throw new Error("This invitation link is invalid or expired. Ask the admin to send a new invitation.");
                }

                window.history.replaceState({}, document.title, window.location.pathname);

                if (active) {
                    setSessionReady(true);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    setError(err?.message || "Could not verify your invitation.");
                    setSessionReady(false);
                }
            } finally {
                if (active) setChecking(false);
            }
        }

        verifyInvitation();
        return () => { active = false; };
    }, []);

    async function handleSuccess() {
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
    }

    return (
        <Box
            mih="100vh"
            p={{ base: "md", sm: "xl" }}
            style={{
                display: "grid",
                placeItems: "center",
                background: "radial-gradient(circle at 85% 15%, rgba(20,184,166,.12), transparent 30%), linear-gradient(135deg, #f2f8f7, #f8fafc)",
            }}
        >
            <Stack w="100%" maw={520} gap="lg">
                <Group justify="center" gap="sm">
                    <ThemeIcon size={42} radius="lg" color="teal">
                        <Activity size={22} />
                    </ThemeIcon>
                    <Box>
                        <Text fw={800} size="lg">MediBook</Text>
                        <Text size="xs" c="dimmed">Healthcare management</Text>
                    </Box>
                </Group>

                {checking && (
                    <Paper withBorder radius="xl" shadow="lg" p="xl">
                        <Center py="xl">
                            <Stack align="center" gap="sm">
                                <Loader color="teal" size="lg" />
                                <Text fw={600}>Verifying your invitation</Text>
                                <Text size="sm" c="dimmed" ta="center">
                                    Please wait while we securely verify your link.
                                </Text>
                            </Stack>
                        </Center>
                    </Paper>
                )}

                {!checking && sessionReady && (
                    <ChangePasswordForm mode="reset" onSuccess={handleSuccess} />
                )}

                {!checking && !sessionReady && (
                    <Paper withBorder radius="xl" shadow="lg" p={{ base: "lg", sm: "xl" }}>
                        <Stack align="center" gap="md">
                            <ThemeIcon size={54} radius="xl" color="red" variant="light">
                                <ShieldCheck size={26} />
                            </ThemeIcon>
                            <Title order={3} ta="center">Invitation unavailable</Title>
                            <Alert color="red" w="100%">{error}</Alert>
                            <Button onClick={() => navigate("/login")} leftSection={<ArrowLeft size={16} />}>
                                Back to sign in
                            </Button>
                        </Stack>
                    </Paper>
                )}

                <Text size="xs" c="dimmed" ta="center">
                    <Stethoscope size={13} style={{ verticalAlign: "middle", marginRight: 5 }} />
                    MediBook secure account setup
                </Text>
            </Stack>
        </Box>
    );
}
