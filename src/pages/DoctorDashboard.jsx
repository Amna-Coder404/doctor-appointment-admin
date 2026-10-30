import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    UserRound,
} from "lucide-react";
import {
    Accordion,
    Alert,
    Avatar,
    Badge,
    Box,
    Button,
    Group,
    Paper,
    SimpleGrid,
    Skeleton,
    Stack,
    Table,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { Link } from "react-router-dom";

import useAppointments from "../hooks/useAppointments";
import DoctorProfileSettings from "../components/doctors/DoctorProfileSettings";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { formatDateTime } from "../utils/utils";

const statusColors = {
    pending: "orange",
    confirmed: "teal",
    completed: "blue",
    cancelled: "red",
};

export default function DoctorDashboard({ profile }) {
    const {
        appointments,
        stats,
        doctor,
        loading,
        error,
        refresh,
    } = useAppointments({ role: "doctor", userId: profile?.id });

    const [doctorProfile, setDoctorProfile] = useState(null);

    useEffect(() => {
        if (doctor) setDoctorProfile(doctor);
    }, [doctor]);

    const upcomingAppointments = useMemo(() => {
        const now = Date.now();

        return appointments
            .filter((appointment) =>
                ["pending", "confirmed"].includes(appointment.status) &&
                new Date(appointment.starts_at).getTime() >= now
            )
            .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
            .slice(0, 5);
    }, [appointments]);

    return (
        <Stack gap="xl">
            <PageHeader
                eyebrow="DOCTOR WORKSPACE"
                title={`Welcome, ${doctorProfile?.full_name || profile?.full_name || "Doctor"}`}
                subtitle="Here is your appointment activity and professional profile."
                action={
                    <Button
                        component={Link}
                        to="/doctor/appointments"
                        leftSection={<CalendarDays size={17} />}
                    >
                        View appointments
                    </Button>
                }
            />

            {error && (
                <Alert color="red" title="Unable to load dashboard" withCloseButton={false}>
                    <Group justify="space-between">
                        <Text size="sm">{error}</Text>
                        <Button size="xs" color="red" variant="light" onClick={refresh}>Retry</Button>
                    </Group>
                </Alert>
            )}

            <Paper
                radius="xl"
                p={{ base: "lg", sm: "xl" }}
                style={{ background: "linear-gradient(120deg, #115e59, #0f766e 65%, #0d9488)", color: "white" }}
            >
                <Group justify="space-between" align="center">
                    <Group gap="md">
                        <Avatar
                            src={doctorProfile?.profile_image_url || profile?.avatar_url}
                            size={68}
                            radius="xl"
                            color="teal"
                        >
                            <UserRound size={30} />
                        </Avatar>
                        <Stack gap={4}>
                            <Text size="xs" fw={700} c="teal.0" tt="uppercase" lts={1}>Your professional profile</Text>
                            <Title order={3} c="white">{doctorProfile?.full_name || profile?.full_name || "Doctor"}</Title>
                            <Text size="sm" c="teal.0">{doctorProfile?.specialization || "Add your specialization in profile settings"}</Text>
                        </Stack>
                    </Group>
                    <Badge color="white" variant="light" size="lg">Doctor account</Badge>
                </Group>
            </Paper>

            <Box>
                <Title order={3} mb="md">Appointment overview</Title>
                <SimpleGrid cols={{ base: 1, xs: 2, xl: 4 }} spacing="md">
                    <StatCard title="Total appointments" value={stats.total} icon={<CalendarDays size={21} />} description="All your bookings" loading={loading} />
                    <StatCard title="Pending" value={stats.pending} icon={<Clock3 size={21} />} color="orange" description="Awaiting your action" loading={loading} />
                    <StatCard title="Confirmed" value={stats.confirmed} icon={<CheckCircle2 size={21} />} color="teal" description="Scheduled visits" loading={loading} />
                    <StatCard title="Completed" value={stats.completed} icon={<UserRound size={21} />} color="blue" description="Finished consultations" loading={loading} />
                </SimpleGrid>
            </Box>

            <Paper withBorder radius="lg" p={{ base: "md", sm: "lg" }}>
                <Group justify="space-between" mb="md">
                    <Box>
                        <Title order={3}>Upcoming appointments</Title>
                        <Text size="sm" c="dimmed">Your next scheduled patient visits.</Text>
                    </Box>
                    <Button component={Link} to="/doctor/appointments" variant="light" size="xs">All appointments</Button>
                </Group>

                {loading ? (
                    <Stack gap="sm">
                        <Skeleton h={48} />
                        <Skeleton h={48} />
                        <Skeleton h={48} />
                    </Stack>
                ) : upcomingAppointments.length ? (
                    <Table.ScrollContainer minWidth={560}>
                        <Table verticalSpacing="sm" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Patient</Table.Th>
                                    <Table.Th>Date & time</Table.Th>
                                    <Table.Th>Fee</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {upcomingAppointments.map((appointment) => (
                                    <Table.Tr key={appointment.id}>
                                        <Table.Td>
                                            <Text fw={600} size="sm">{appointment.patient?.full_name || "Unknown patient"}</Text>
                                            <Text size="xs" c="dimmed">{appointment.patient?.email || "No email"}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{formatDateTime(appointment.starts_at)}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={600}>Rs. {Number(appointment.consultation_fee || 0).toLocaleString()}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={statusColors[appointment.status] || "gray"} variant="light">
                                                {appointment.status}
                                            </Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                ) : (
                    <Stack align="center" py="xl" gap={6}>
                        <ThemeIcon size={48} radius="xl" variant="light" color="teal"><CalendarDays size={23} /></ThemeIcon>
                        <Text fw={600}>No upcoming appointments</Text>
                        <Text size="sm" c="dimmed">New bookings will appear here.</Text>
                    </Stack>
                )}
            </Paper>

            <Accordion variant="separated" radius="lg">
                <Accordion.Item value="profile">
                    <Accordion.Control>
                        <Stack gap={2}>
                            <Text fw={700}>Professional profile & account security</Text>
                            <Text size="xs" c="dimmed">Update your information, photo and password.</Text>
                        </Stack>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <DoctorProfileSettings
                            doctor={doctorProfile}
                            profile={profile}
                            onUpdated={setDoctorProfile}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Stack>
    );
}
