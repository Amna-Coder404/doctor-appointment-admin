import {
    CalendarDays,
    Check,
    CheckCheck,
    Clock3,
    RefreshCw,
    Search,
    X,
} from "lucide-react";
import {
    ActionIcon,
    Alert,
    Badge,
    Button,
    Group,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    Tooltip,
} from "@mantine/core";

import useAppointments from "../hooks/useAppointments";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { formatDate, formatTime } from "../utils/utils";

const statusColors = {
    pending: "orange",
    confirmed: "teal",
    completed: "blue",
    cancelled: "red",
};

export default function AppointmentManagement({ role = "admin", userId = null }) {
    const {
        appointments,
        stats,
        loading,
        updatingId,
        statusFilter,
        setStatusFilter,
        search,
        setSearch,
        error,
        success,
        changeStatus,
        refresh,
    } = useAppointments({ role, userId });

    const isDoctor = role === "doctor";

    return (
        <Stack gap="xl">
            <PageHeader
                eyebrow={isDoctor ? "DOCTOR WORKSPACE" : "ADMINISTRATION"}
                title={isDoctor ? "My appointments" : "Appointment management"}
                subtitle={isDoctor
                    ? "Review patient bookings and update appointment progress."
                    : "Review patient bookings and manage appointment status."}
                action={
                    <Button
                        variant="light"
                        color="gray"
                        leftSection={<RefreshCw size={16} />}
                        onClick={refresh}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                }
            />

            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                <StatCard title="Total" value={stats.total} icon={<CalendarDays size={20} />} description="All bookings" loading={loading} />
                <StatCard title="Pending" value={stats.pending} icon={<Clock3 size={20} />} color="orange" description="Awaiting action" loading={loading} />
                <StatCard title="Confirmed" value={stats.confirmed} icon={<Check size={20} />} color="teal" description="Scheduled" loading={loading} />
                <StatCard title="Completed" value={stats.completed} icon={<CheckCheck size={20} />} color="blue" description="Finished" loading={loading} />
            </SimpleGrid>

            {error && <Alert color="red" title="Appointment update failed">{error}</Alert>}
            {success && <Alert color="teal" title="Updated">{success}</Alert>}

            <Paper withBorder radius="lg" p={{ base: "md", sm: "lg" }}>
                <Stack gap="md">
                    <Group justify="space-between">
                        <Stack gap={3}>
                            <Title order={3}>{isDoctor ? "Patient bookings" : "All bookings"}</Title>
                            <Text size="sm" c="dimmed">{appointments.length} matching appointments</Text>
                        </Stack>
                    </Group>

                    <Group align="flex-end" grow>
                        <TextInput
                            leftSection={<Search size={17} />}
                            placeholder={isDoctor ? "Search patient name or email" : "Search patient or doctor"}
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                        />
                        <Select
                            label="Appointment status"
                            data={[
                                { value: "all", label: "All statuses" },
                                { value: "pending", label: "Pending" },
                                { value: "confirmed", label: "Confirmed" },
                                { value: "completed", label: "Completed" },
                                { value: "cancelled", label: "Cancelled" },
                            ]}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            allowDeselect={false}
                            w={{ base: "100%", sm: 190 }}
                            flex="0 0 190px"
                        />
                    </Group>

                    {loading && !appointments.length ? (
                        <Text c="dimmed" ta="center" py="xl">Loading appointments...</Text>
                    ) : appointments.length === 0 ? (
                        <Stack align="center" py="xl" gap={6}>
                            <CalendarDays size={30} color="var(--mantine-color-dimmed)" />
                            <Text fw={600}>No appointments found</Text>
                            <Text size="sm" c="dimmed">Try changing your search or status filter.</Text>
                        </Stack>
                    ) : (
                        <Table.ScrollContainer minWidth={isDoctor ? 700 : 850}>
                            <Table verticalSpacing="sm" highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Patient</Table.Th>
                                        {!isDoctor && <Table.Th>Doctor</Table.Th>}
                                        <Table.Th>Date & time</Table.Th>
                                        <Table.Th>Fee</Table.Th>
                                        <Table.Th>Payment</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th ta="right">Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {appointments.map((appointment) => {
                                        const canConfirm = appointment.status === "pending";
                                        const canComplete = appointment.status === "confirmed";
                                        const canCancel = ["pending", "confirmed"].includes(appointment.status);

                                        return (
                                            <Table.Tr key={appointment.id}>
                                                <Table.Td>
                                                    <Text size="sm" fw={600}>{appointment.patient?.full_name || "Unknown patient"}</Text>
                                                    <Text size="xs" c="dimmed">{appointment.patient?.email || "No email"}</Text>
                                                </Table.Td>
                                                {!isDoctor && (
                                                    <Table.Td>
                                                        <Text size="sm" fw={600}>{appointment.doctor?.full_name || "Unknown doctor"}</Text>
                                                        <Text size="xs" c="dimmed">{appointment.doctor?.specialization || "—"}</Text>
                                                    </Table.Td>
                                                )}
                                                <Table.Td>
                                                    <Text size="sm" fw={600}>{formatDate(appointment.starts_at)}</Text>
                                                    <Text size="xs" c="dimmed">{formatTime(appointment.starts_at)} – {formatTime(appointment.ends_at)}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" fw={600}>Rs. {Number(appointment.consultation_fee || 0).toLocaleString()}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge color={appointment.payment_status === "paid" ? "teal" : "gray"} variant="light">
                                                        {appointment.payment_status || "unpaid"}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge color={statusColors[appointment.status] || "gray"} variant="light">
                                                        {appointment.status}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group justify="flex-end" gap={5} wrap="nowrap">
                                                        {canConfirm && (
                                                            <Tooltip label="Confirm appointment">
                                                                <ActionIcon
                                                                    color="teal"
                                                                    variant="light"
                                                                    loading={updatingId === appointment.id}
                                                                    disabled={Boolean(updatingId) && updatingId !== appointment.id}
                                                                    onClick={() => changeStatus(appointment, "confirmed")}
                                                                    aria-label="Confirm appointment"
                                                                >
                                                                    <Check size={16} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                        {canComplete && (
                                                            <Tooltip label="Mark completed">
                                                                <ActionIcon
                                                                    color="blue"
                                                                    variant="light"
                                                                    loading={updatingId === appointment.id}
                                                                    disabled={Boolean(updatingId) && updatingId !== appointment.id}
                                                                    onClick={() => changeStatus(appointment, "completed")}
                                                                    aria-label="Complete appointment"
                                                                >
                                                                    <CheckCheck size={16} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                        {canCancel && (
                                                            <Tooltip label="Cancel appointment">
                                                                <ActionIcon
                                                                    color="red"
                                                                    variant="light"
                                                                    loading={updatingId === appointment.id}
                                                                    disabled={Boolean(updatingId) && updatingId !== appointment.id}
                                                                    onClick={() => changeStatus(appointment, "cancelled")}
                                                                    aria-label="Cancel appointment"
                                                                >
                                                                    <X size={16} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                        {!canConfirm && !canComplete && !canCancel && (
                                                            <Text size="xs" c="dimmed">No actions</Text>
                                                        )}
                                                    </Group>
                                                </Table.Td>
                                            </Table.Tr>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    )}
                </Stack>
            </Paper>
        </Stack>
    );
}
