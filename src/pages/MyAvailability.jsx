import { CalendarDays, CalendarOff, Clock3, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import {
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
    Textarea,
    Title,
} from "@mantine/core";

import useMyAvailability from "../hooks/useMyAvailability";
import PageHeader from "../components/ui/PageHeader";
import { DAYS, formatDateTime, formatTime } from "../utils/utils";

const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "20", label: "20 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
];

export default function MyAvailability({ profile }) {
    const {
        doctor,
        schedules,
        unavailable,
        schedule,
        setSchedule,
        leave,
        setLeave,
        editingId,
        startEditing,
        cancelEditing,
        loading,
        savingSchedule,
        savingLeave,
        deletingId,
        error,
        success,
        loadData,
        handleSaveSchedule,
        handleSaveLeave,
        handleDelete,
    } = useMyAvailability(profile?.id);

    return (
        <Stack gap="xl">
            <PageHeader
                eyebrow="DOCTOR WORKSPACE"
                title="My availability"
                subtitle="Manage your recurring working hours and time off."
                action={
                    <Button
                        variant="light"
                        color="gray"
                        leftSection={<RefreshCw size={16} />}
                        onClick={loadData}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                }
            />

            {doctor && (
                <Paper withBorder radius="lg" p="md">
                    <Group gap="sm">
                        <CalendarDays size={22} color="var(--mantine-color-teal-7)" />
                        <div>
                            <Text fw={700}>{doctor.full_name}</Text>
                            <Text size="sm" c="dimmed">{doctor.specialization || "Doctor"}</Text>
                        </div>
                    </Group>
                </Paper>
            )}

            {error && <Alert color="red" title="Unable to update availability">{error}</Alert>}
            {success && <Alert color="teal" title="Updated">{success}</Alert>}

            <Paper withBorder radius="lg" p={{ base: "md", sm: "lg" }}>
                <Stack gap="md">
                    <Group gap="sm">
                        <Clock3 size={20} />
                        <div>
                            <Title order={3}>Weekly working hours</Title>
                            <Text size="sm" c="dimmed">{editingId ? "Update the selected working schedule." : "Add the recurring hours when patients can book appointments."}</Text>
                        </div>
                    </Group>

                    <form onSubmit={handleSaveSchedule}>
                        <Stack gap="md">
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
                                <Select
                                    label="Working day"
                                    data={DAYS}
                                    value={schedule.day_of_week}
                                    onChange={(value) => setSchedule((current) => ({ ...current, day_of_week: value ?? "1" }))}
                                    allowDeselect={false}
                                />
                                <TextInput label="Start time" type="time" value={schedule.start_time} onChange={(event) => setSchedule((current) => ({ ...current, start_time: event.currentTarget.value }))} required />
                                <TextInput label="End time" type="time" value={schedule.end_time} onChange={(event) => setSchedule((current) => ({ ...current, end_time: event.currentTarget.value }))} required />
                                <Select
                                    label="Appointment duration"
                                    data={durationOptions}
                                    value={schedule.slot_duration_minutes}
                                    onChange={(value) => setSchedule((current) => ({ ...current, slot_duration_minutes: value ?? "30" }))}
                                    allowDeselect={false}
                                />
                            </SimpleGrid>
                            <Group justify="flex-end">
                                {editingId && (
                                    <Button variant="default" leftSection={<X size={15} />} onClick={cancelEditing}>
                                        Cancel edit
                                    </Button>
                                )}
                                <Button type="submit" loading={savingSchedule} leftSection={editingId ? <Pencil size={15} /> : <Plus size={15} />}>
                                    {editingId ? "Update schedule" : "Add working hours"}
                                </Button>
                            </Group>
                        </Stack>
                    </form>

                    <Table.ScrollContainer minWidth={570}>
                        <Table verticalSpacing="sm" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Day</Table.Th>
                                    <Table.Th>Hours</Table.Th>
                                    <Table.Th>Slot</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th ta="right">Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {schedules.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>{DAYS.find((day) => day.value === String(item.day_of_week))?.label || "Unknown"}</Table.Td>
                                        <Table.Td>{formatTime(item.start_time)} – {formatTime(item.end_time)}</Table.Td>
                                        <Table.Td>{item.slot_duration_minutes} min</Table.Td>
                                        <Table.Td><Badge color={item.is_active ? "teal" : "gray"} variant="light">{item.is_active ? "Active" : "Inactive"}</Badge></Table.Td>
                                        <Table.Td>
                                            <Group justify="flex-end" gap={5}>
                                                <Button size="xs" variant="light" leftSection={<Pencil size={13} />} onClick={() => startEditing(item)}>Edit</Button>
                                                <Button size="xs" variant="light" color="red" leftSection={<Trash2 size={13} />} loading={deletingId === item.id} onClick={() => handleDelete("doctor_availability", item.id, "working schedule")}>Delete</Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                                {!loading && schedules.length === 0 && (
                                    <Table.Tr><Table.Td colSpan={5}><Text ta="center" c="dimmed" py="md">No working hours configured yet.</Text></Table.Td></Table.Tr>
                                )}
                                {loading && schedules.length === 0 && (
                                    <Table.Tr><Table.Td colSpan={5}><Text ta="center" c="dimmed" py="md">Loading your schedule...</Text></Table.Td></Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Stack>
            </Paper>

            <Paper withBorder radius="lg" p={{ base: "md", sm: "lg" }}>
                <Stack gap="md">
                    <Group gap="sm">
                        <CalendarOff size={20} />
                        <div>
                            <Title order={3}>Time off and unavailable periods</Title>
                            <Text size="sm" c="dimmed">Block dates when you are not available for appointments.</Text>
                        </div>
                    </Group>

                    <form onSubmit={handleSaveLeave}>
                        <Stack gap="md">
                            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                <TextInput label="Starts at" type="datetime-local" value={leave.starts_at} onChange={(event) => setLeave((current) => ({ ...current, starts_at: event.currentTarget.value }))} required />
                                <TextInput label="Ends at" type="datetime-local" value={leave.ends_at} onChange={(event) => setLeave((current) => ({ ...current, ends_at: event.currentTarget.value }))} required />
                            </SimpleGrid>
                            <Textarea label="Reason (optional)" placeholder="e.g. Personal leave" value={leave.reason} onChange={(event) => setLeave((current) => ({ ...current, reason: event.currentTarget.value }))} minRows={2} autosize />
                            <Group justify="flex-end">
                                <Button type="submit" loading={savingLeave} leftSection={<Plus size={16} />}>Add unavailable period</Button>
                            </Group>
                        </Stack>
                    </form>

                    <Table.ScrollContainer minWidth={650}>
                        <Table verticalSpacing="sm" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Starts</Table.Th>
                                    <Table.Th>Ends</Table.Th>
                                    <Table.Th>Reason</Table.Th>
                                    <Table.Th ta="right">Action</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {unavailable.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>{formatDateTime(item.starts_at)}</Table.Td>
                                        <Table.Td>{formatDateTime(item.ends_at)}</Table.Td>
                                        <Table.Td>{item.reason || "Not specified"}</Table.Td>
                                        <Table.Td>
                                            <Group justify="flex-end">
                                                <Button size="xs" variant="light" color="red" leftSection={<Trash2 size={14} />} loading={deletingId === item.id} onClick={() => handleDelete("doctor_unavailability", item.id, "unavailable period")}>Delete</Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                                {!loading && unavailable.length === 0 && (
                                    <Table.Tr><Table.Td colSpan={4}><Text ta="center" c="dimmed" py="md">No unavailable periods added.</Text></Table.Td></Table.Tr>
                                )}
                                {loading && unavailable.length === 0 && (
                                    <Table.Tr><Table.Td colSpan={4}><Text ta="center" c="dimmed" py="md">Loading unavailable periods...</Text></Table.Td></Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Stack>
            </Paper>
        </Stack>
    );
}
