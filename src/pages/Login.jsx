
import {
    Activity,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Stethoscope,
    Users,
} from "lucide-react";

import {
    Alert,
    Box,
    Button,
    Center,
    Grid,
    Group,
    Paper,
    PasswordInput,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
} from "@mantine/core";

import useLogin from "../hooks/useLogin";

const features = [
    {
        icon: CalendarDays,
        title: "Appointment management",
        description: "Manage schedules and patient appointments.",
    },
    {
        icon: Users,
        title: "Doctor workspace",
        description: "Keep your clinic operations organized.",
    },
    {
        icon: ShieldCheck,
        title: "Secure access",
        description: "Private access for authorized staff.",
    },
];

export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        submitting,
        handleSubmit,
        role,
        setRole,
    } = useLogin();

    const selectedRole = role === "admin" ? "Administrator" : "Doctor";

    return (
        <Box
            mih="100vh"
            p={{ base: "sm", sm: "xl" }}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F5F8FA",
                backgroundImage:
                    "radial-gradient(ellipse at 10% 10%, rgba(20,184,166,.08), transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(45,212,191,.07), transparent 35%)",
            }}
        >
            <Paper
                radius={24}
                shadow="xl"
                w="100%"
                maw={1080}
                style={{
                    overflow: "hidden",
                    border: "1px solid #E8EEF2",
                }}
            >
                <Grid gutter={0} align="stretch">
                    {/* Branding panel */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Box
                            h="100%"
                            p={{ base: "xl", sm: 42 }}
                            style={{
                                position: "relative",
                                overflow: "hidden",
                                color: "white",
                                background:
                                    "linear-gradient(145deg, #0f766e 0%, #115e59 48%, #123b4a 100%)",
                            }}
                        >
                            <Box
                                style={{
                                    position: "absolute",
                                    width: 280,
                                    height: 280,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(255,255,255,.12)",
                                    top: -120,
                                    right: -100,
                                }}
                            />

                            <Box
                                style={{
                                    position: "absolute",
                                    width: 200,
                                    height: 200,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(255,255,255,.10)",
                                    bottom: -100,
                                    left: -80,
                                }}
                            />

                            <Stack
                                justify="space-between"
                                h="100%"
                                gap={45}
                                style={{ position: "relative", zIndex: 1 }}
                            >
                                <Group gap="sm">
                                    <ThemeIcon
                                        size={48}
                                        radius="lg"
                                        variant="white"
                                        color="teal"
                                    >
                                        <Activity size={26} />
                                    </ThemeIcon>

                                    <Box>
                                        <Text fw={800} size="xl" c="white">
                                            CareUp
                                        </Text>
                                        <Text
                                            size="xs"
                                            c="teal.1"
                                            fw={600}
                                            lts={1}
                                        >
                                            HEALTHCARE MANAGEMENT
                                        </Text>
                                    </Box>
                                </Group>

                                <Stack gap="lg">
                                    <Box>
                                        <Text
                                            size="xs"
                                            fw={700}
                                            c="teal.1"
                                            tt="uppercase"
                                            lts={2}
                                            mb="sm"
                                        >
                                            Your clinic. Your control.
                                        </Text>

                                        <Title
                                            order={1}
                                            c="white"
                                            style={{
                                                fontSize:
                                                    "clamp(30px, 4vw, 43px)",
                                                lineHeight: 1.15,
                                                letterSpacing: -1.5,
                                            }}
                                        >
                                            Healthcare,
                                            <br />
                                            made simpler.
                                        </Title>

                                        <Text
                                            c="teal.0"
                                            size="sm"
                                            mt="md"
                                            maw={350}
                                            lh={1.8}
                                        >
                                            A centralized workspace to manage
                                            doctors, appointments and your
                                            clinic operations.
                                        </Text>
                                    </Box>

                                    <Stack gap="lg" mt="sm">
                                        {features.map((feature) => {
                                            const Icon = feature.icon;

                                            return (
                                                <Group
                                                    key={feature.title}
                                                    gap="md"
                                                    align="center"
                                                    wrap="nowrap"
                                                >
                                                    <ThemeIcon
                                                        size={42}
                                                        radius="md"
                                                        variant="light"
                                                        color="teal"
                                                        style={{
                                                            background:
                                                                "rgba(255,255,255,.13)",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <Icon size={20} />
                                                    </ThemeIcon>

                                                    <Box>
                                                        <Text
                                                            fw={700}
                                                            size="sm"
                                                            c="white"
                                                        >
                                                            {feature.title}
                                                        </Text>
                                                        <Text
                                                            size="xs"
                                                            c="teal.1"
                                                            mt={3}
                                                        >
                                                            {feature.description}
                                                        </Text>
                                                    </Box>
                                                </Group>
                                            );
                                        })}
                                    </Stack>
                                </Stack>

                                <Group gap={8}>
                                    <CheckCircle2 size={15} color="#99f6e4" />
                                    <Text size="xs" c="teal.1">
                                        Designed for modern healthcare teams
                                    </Text>
                                </Group>
                            </Stack>
                        </Box>
                    </Grid.Col>

                    {/* Login panel */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Center
                            h="100%"
                            p={{ base: "xl", sm: 48 }}
                            style={{ background: "#ffffff" }}
                        >
                            <Stack w="100%" maw={380} gap="xl">
                                <Box>
                                    <Text
                                        size="xs"
                                        fw={700}
                                        c="teal.7"
                                        tt="uppercase"
                                        lts={1.5}
                                        mb="sm"
                                    >
                                        Welcome to CareUp
                                    </Text>

                                    <Title
                                        order={2}
                                        c="#172b3a"
                                        style={{
                                            letterSpacing: -1,
                                            fontSize: 30,
                                        }}
                                    >
                                        Sign in to your account
                                    </Title>

                                    <Text size="sm" c="dimmed" mt={8}>
                                        Select your workspace and enter your
                                        login credentials.
                                    </Text>
                                </Box>

                                {/* Role selection */}
                                <Stack gap="sm">
                                    <Group justify="space-between">
                                        <Text
                                            size="sm"
                                            fw={700}
                                            c="#344b5a"
                                        >
                                            Sign in as
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="teal.7"
                                            fw={600}
                                        >
                                            {selectedRole}
                                        </Text>
                                    </Group>

                                    <SegmentedControl
                                        fullWidth
                                        size="lg"
                                        radius="md"
                                        value={role}
                                        onChange={setRole}
                                        color="teal"
                                        data={[
                                            {
                                                value: "admin",
                                                label: (
                                                    <Group
                                                        justify="center"
                                                        gap={8}
                                                        wrap="nowrap"
                                                    >
                                                        <ShieldCheck
                                                            size={17}
                                                        />
                                                        <Text
                                                            size="sm"
                                                            fw={600}
                                                        >
                                                            Admin
                                                        </Text>
                                                    </Group>
                                                ),
                                            },
                                            {
                                                value: "doctor",
                                                label: (
                                                    <Group
                                                        justify="center"
                                                        gap={8}
                                                        wrap="nowrap"
                                                    >
                                                        <Stethoscope
                                                            size={17}
                                                        />
                                                        <Text
                                                            size="sm"
                                                            fw={600}
                                                        >
                                                            Doctor
                                                        </Text>
                                                    </Group>
                                                ),
                                            },
                                        ]}
                                    />

                                    <Text size="xs" c="dimmed">
                                        {role === "admin"
                                            ? "Access clinic management, doctors and appointments."
                                            : "Access your personal doctor workspace and appointments."}
                                    </Text>
                                </Stack>

                                {error && (
                                    <Alert
                                        color="red"
                                        radius="md"
                                        title="Unable to sign in"
                                        icon={<ShieldCheck size={18} />}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Stack gap="lg">
                                        <TextInput
                                            label="Email address"
                                            placeholder="you@clinic.com"
                                            type="email"
                                            size="md"
                                            radius="md"
                                            leftSection={<Mail size={17} />}
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(
                                                    event.currentTarget.value
                                                )
                                            }
                                            autoComplete="username"
                                            required
                                        />

                                        <PasswordInput
                                            label="Password"
                                            placeholder="Enter your password"
                                            size="md"
                                            radius="md"
                                            leftSection={
                                                <LockKeyhole size={17} />
                                            }
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(
                                                    event.currentTarget.value
                                                )
                                            }
                                            autoComplete="current-password"
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            fullWidth
                                            size="lg"
                                            radius="md"
                                            color="teal"
                                            loading={submitting}
                                            disabled={
                                                !email.trim() || !password
                                            }
                                            rightSection={
                                                !submitting && (
                                                    <ArrowRight size={18} />
                                                )
                                            }
                                            mt="xs"
                                        >
                                            Sign in as {role === "admin" ? "Admin" : "Doctor"}
                                        </Button>
                                    </Stack>
                                </form>

                                <Box
                                    h={1}
                                    style={{ background: "#edf0f2" }}
                                />

                                <Stack gap="sm">
                                    <Group justify="center" gap={7}>
                                        <ShieldCheck
                                            size={15}
                                            color="#0f766e"
                                        />
                                        <Text
                                            size="xs"
                                            fw={600}
                                            c="gray.7"
                                        >
                                            Secure and protected access
                                        </Text>
                                    </Group>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        ta="center"
                                        lh={1.7}
                                    >
                                        This workspace is restricted to
                                        authorized administrators and doctors.
                                    </Text>
                                </Stack>
                            </Stack>
                        </Center>
                    </Grid.Col>
                </Grid>
            </Paper>
        </Box>
    );
}
