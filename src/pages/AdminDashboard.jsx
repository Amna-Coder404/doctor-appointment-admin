import {
    Activity,
    CalendarDays,
    Clock3,
    Stethoscope,
} from "lucide-react";
import {
    Alert,
    Badge,
    Box,
    Button,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { Link } from "react-router-dom";

import useAdminDashboard from "../hooks/useAdminDashboard";
import ManagementCard from "../components/ManagementCard";
import ChangePasswordForm from "../components/ChangePasswordForm";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

export default function AdminDashboard({ profile }) {
    const { stats, loading, error, refreshStats } = useAdminDashboard();

    return (
        <Stack gap="xl">
            <PageHeader
                eyebrow="Overview"
                title="Admin dashboard"
                subtitle="Monitor your clinic and manage daily operations."
                action={<Badge color="teal" variant="light" size="lg">Administrator access</Badge>}
            />

            <Paper
                radius="xl"
                p={{ base: "lg", sm: "xl" }}
                style={{
                    overflow: "hidden",
                    background: "linear-gradient(120deg, #0f766e 0%, #115e59 65%, #134e4a 100%)",
                    color: "white",
                }}
            >
                <Group justify="space-between" align="center" wrap="nowrap">
                    <Stack gap="sm" maw={620}>
                        <Badge color="teal" variant="light" w="fit-content" style={{ background: "rgba(255,255,255,.16)", color: "#ffffff" }}>CLINIC WORKSPACE</Badge>
                        <Title order={2} c="white" size="h2">
                            Welcome back, {profile?.full_name || "Admin"}
                        </Title>
                        <Text c="teal.0" size="sm" lh={1.7}>
                            Keep your doctors, appointments and availability organized from one place.
                        </Text>
                        <Button
                            component={Link}
                            to="/admin/appointments"
                            color="teal"
                            variant="white"
                            w="fit-content"
                            mt="xs"
                        >
                            Review appointments
                        </Button>
                    </Stack>
                    <ThemeIcon
                        visibleFrom="sm"
                        size={104}
                        radius="xl"
                        variant="light"
                        color="teal"
                        style={{ background: "rgba(255,255,255,.12)", color: "#ffffff" }}
                    >
                        <Activity size={48} />
                    </ThemeIcon>
                </Group>
            </Paper>

            {error && (
                <Alert color="red" title="Dashboard data unavailable" withCloseButton={false}>
                    <Group justify="space-between">
                        <Text size="sm">{error}</Text>
                        <Button size="xs" variant="light" color="red" onClick={refreshStats}>Retry</Button>
                    </Group>
                </Alert>
            )}

            <Box>
                <Group justify="space-between" mb="md">
                    <Title order={3}>Clinic overview</Title>
                    <Text size="xs" c="dimmed">Live Supabase counts</Text>
                </Group>
                <SimpleGrid cols={{ base: 1, xs: 2, lg: 3 }} spacing="md">
                    <StatCard
                        title="Total doctors"
                        value={stats.doctors}
                        icon={<Stethoscope size={22} />}
                        color="teal"
                        description="Registered doctors"
                        loading={loading}
                    />
                    <StatCard
                        title="Appointments"
                        value={stats.appointments}
                        icon={<CalendarDays size={22} />}
                        color="blue"
                        description="All bookings"
                        loading={loading}
                    />
                    <StatCard
                        title="Pending bookings"
                        value={stats.pending}
                        icon={<Clock3 size={22} />}
                        color="orange"
                        description="Awaiting action"
                        loading={loading}
                    />
                </SimpleGrid>
            </Box>

            <Box>
                <Stack gap={4} mb="md">
                    <Title order={3}>Management</Title>
                    <Text size="sm" c="dimmed">Choose a workspace to continue.</Text>
                </Stack>
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
                    <ManagementCard
                        icon={<Stethoscope size={22} />}
                        title="Doctors"
                        description="Create doctor accounts, update professional details and manage account status."
                        target="/admin/doctors"
                        color="teal"
                    />
                    <ManagementCard
                        icon={<CalendarDays size={22} />}
                        title="Appointments"
                        description="Review patient bookings and manage appointment status."
                        target="/admin/appointments"
                        color="blue"
                    />
                    <ManagementCard
                        icon={<Clock3 size={22} />}
                        title="Availability"
                        description="Configure weekly working hours and unavailable periods for doctors."
                        target="/admin/availability"
                        color="violet"
                    />
                </SimpleGrid>
            </Box>

            <Box>
                <Stack gap={4} mb="md">
                    <Title order={3}>Account security</Title>
                    <Text size="sm" c="dimmed">Update your administrator password.</Text>
                </Stack>
                <ChangePasswordForm />
            </Box>
        </Stack>
    );
}
