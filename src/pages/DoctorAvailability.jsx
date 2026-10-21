
import { Alert, Badge, Box, Button, Group, Paper, Select, SimpleGrid, Stack, Table, Text, TextInput, Textarea, Title, } from "@mantine/core";

import { CalendarDays, Clock, Plus, RefreshCw, Trash2, } from "lucide-react";



import "../styles/DoctorsManagement.css";
import { DAYS, formatDateTime, formatTime } from "../utils/utils";
import useDoctorAvailability from "../hooks/useDoctorAvailability";

export default function DoctorAvailability() {
    const {
        doctors,
        doctorId,
        setDoctorId,
        selectedDoctor,
        schedules,
        unavailable,
        schedule,
        setSchedule,
        leave,
        setLeave,
        loading,
        savingSchedule,
        savingLeave,
        deletingId,
        error,
        success,
        loadDoctorData,
        handleAddSchedule,
        handleAddUnavailable,
        handleDelete,
    } = useDoctorAvailability();

    return (
        <Box className="doctors-page">
            <Stack gap="xl">
                <div className="doctors-header">
                    <div>
                        <Text className="eyebrow">   ADMINISTRATION   </Text>

                        <Title order={1}>
                            Doctor Availability
                        </Title>

                        <Text className="muted">
                            Manage weekly working hours and unavailable periods.
                        </Text>
                    </div>
                </div>

                {error && (
                    <Alert color="red" title="Error" role="alert">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert color="green" title="Success">
                        {success}
                    </Alert>
                )}

                {/* Select doctor */}
                <Paper className="doctors-panel" withBorder radius="lg" p="md"    >
                    <Stack gap="md">
                        <Title order={3}>Select Doctor</Title>

                        <Select
                            label="Doctor"
                            placeholder="Choose a doctor"
                            data={doctors.map((doctor) => ({
                                value: doctor.id,
                                label: `${doctor.full_name} — ${doctor.specialization || "General"
                                    }`,
                            }))}
                            value={doctorId}
                            onChange={setDoctorId}
                            searchable
                            clearable={false}
                            nothingFoundMessage="No doctors found"
                        />

                        {selectedDoctor && (
                            <Group gap="xs">
                                <Text size="sm" c="dimmed">
                                    Account status:
                                </Text>

                                <Badge color={selectedDoctor.is_active ? "green" : "gray"} >
                                    {selectedDoctor.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </Group>
                        )}
                    </Stack>
                </Paper>

                {/* Weekly working hours */}
                <Paper
                    className="doctors-panel"
                    withBorder
                    radius="lg"
                    p="md"
                >
                    <Stack gap="md">
                        <Group gap="xs">
                            <Clock size={20} />
                            <Title order={3}>
                                Weekly Working Hours
                            </Title>
                        </Group>

                        <Text className="muted" size="sm">
                            Add the recurring working hours when this doctor
                            accepts appointments.
                        </Text>

                        <form onSubmit={handleAddSchedule}>
                            <Stack gap="md">
                                <SimpleGrid
                                    cols={{ base: 1, sm: 2, md: 4 }}
                                >
                                    <Select
                                        label="Day"
                                        data={DAYS}
                                        value={schedule.day_of_week}
                                        onChange={(value) =>
                                            setSchedule((current) => ({
                                                ...current,
                                                day_of_week: value ?? "1",
                                            }))
                                        }
                                        required
                                    />

                                    <TextInput
                                        label="Start time"
                                        type="time"
                                        value={schedule.start_time}
                                        onChange={(event) =>
                                            setSchedule((current) => ({
                                                ...current,
                                                start_time:
                                                    event.currentTarget.value,
                                            }))
                                        }
                                        required
                                    />

                                    <TextInput
                                        label="End time"
                                        type="time"
                                        value={schedule.end_time}
                                        onChange={(event) =>
                                            setSchedule((current) => ({
                                                ...current,
                                                end_time:
                                                    event.currentTarget.value,
                                            }))
                                        }
                                        required
                                    />

                                    <Select
                                        label="Appointment duration"
                                        data={[
                                            { value: "15", label: "15 minutes" },
                                            { value: "20", label: "20 minutes" },
                                            { value: "30", label: "30 minutes" },
                                            { value: "45", label: "45 minutes" },
                                            { value: "60", label: "60 minutes" },
                                        ]}
                                        value={schedule.slot_duration_minutes}
                                        onChange={(value) =>
                                            setSchedule((current) => ({
                                                ...current,
                                                slot_duration_minutes:
                                                    value ?? "30",
                                            }))
                                        }
                                        required
                                    />
                                </SimpleGrid>

                                <Group justify="flex-end">
                                    <Button
                                        className="doctor-btn doctor-btn-primary"
                                        type="submit"
                                        leftSection={<Plus size={17} />}
                                        loading={savingSchedule}
                                        disabled={!doctorId}
                                    >
                                        Add Working Hours
                                    </Button>
                                </Group>
                            </Stack>
                        </form>

                        <Table.ScrollContainer minWidth={600}>
                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Day</Table.Th>
                                        <Table.Th>Working Hours</Table.Th>
                                        <Table.Th>Slot Duration</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {schedules.map((item) => (
                                        <Table.Tr key={item.id}>
                                            <Table.Td>
                                                {DAYS.find(
                                                    (day) =>
                                                        day.value ===
                                                        String(item.day_of_week)
                                                )?.label ?? "Unknown"}
                                            </Table.Td>

                                            <Table.Td>
                                                {formatTime(item.start_time)} –{" "}
                                                {formatTime(item.end_time)}
                                            </Table.Td>

                                            <Table.Td>
                                                {item.slot_duration_minutes} min
                                            </Table.Td>

                                            <Table.Td>
                                                <Badge
                                                    color={
                                                        item.is_active
                                                            ? "green"
                                                            : "gray"
                                                    }
                                                >
                                                    {item.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </Table.Td>

                                            <Table.Td>
                                                <Button
                                                    className="doctor-btn"
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    leftSection={
                                                        <Trash2 size={14} />
                                                    }
                                                    loading={
                                                        deletingId === item.id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            "doctor_availability",
                                                            item.id,
                                                            "working schedule"
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    Delete
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}

                                    {!loading && schedules.length === 0 && (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <Text
                                                    c="dimmed"
                                                    ta="center"
                                                    py="md"
                                                >
                                                    No working hours added for
                                                    this doctor.
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}

                                    {loading && (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <Text
                                                    c="dimmed"
                                                    ta="center"
                                                    py="md"
                                                >
                                                    Loading working hours...
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Stack>
                </Paper>

                {/* Unavailable dates and times */}
                <Paper
                    className="doctors-panel"
                    withBorder
                    radius="lg"
                    p="md"
                >
                    <Stack gap="md">
                        <Group gap="xs">
                            <CalendarDays size={20} />

                            <Title order={3}>
                                Unavailable Dates & Times
                            </Title>
                        </Group>

                        <Text className="muted" size="sm">
                            Block specific periods for leave, holidays, breaks,
                            or other reasons. Use your local date and time.
                        </Text>

                        <form onSubmit={handleAddUnavailable}>
                            <Stack gap="md">
                                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                    <TextInput
                                        label="Start date and time"
                                        type="datetime-local"
                                        value={leave.starts_at}
                                        onChange={(event) =>
                                            setLeave((current) => ({
                                                ...current,
                                                starts_at:
                                                    event.currentTarget.value,
                                            }))
                                        }
                                        required
                                    />

                                    <TextInput
                                        label="End date and time"
                                        type="datetime-local"
                                        value={leave.ends_at}
                                        onChange={(event) =>
                                            setLeave((current) => ({
                                                ...current,
                                                ends_at:
                                                    event.currentTarget.value,
                                            }))
                                        }
                                        required
                                    />
                                </SimpleGrid>

                                <Textarea
                                    label="Reason (optional)"
                                    placeholder="e.g. Doctor on leave"
                                    value={leave.reason}
                                    onChange={(event) =>
                                        setLeave((current) => ({
                                            ...current,
                                            reason:
                                                event.currentTarget.value,
                                        }))
                                    }
                                    autosize
                                    minRows={2}
                                />

                                <Group justify="flex-end">
                                    <Button
                                        className="doctor-btn doctor-btn-primary"
                                        type="submit"
                                        leftSection={<Plus size={17} />}
                                        loading={savingLeave}
                                        disabled={!doctorId}
                                    >
                                        Add Unavailable Period
                                    </Button>
                                </Group>
                            </Stack>
                        </form>

                        <Table.ScrollContainer minWidth={650}>
                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Starts</Table.Th>
                                        <Table.Th>Ends</Table.Th>
                                        <Table.Th>Reason</Table.Th>
                                        <Table.Th>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {unavailable.map((item) => (
                                        <Table.Tr key={item.id}>
                                            <Table.Td>
                                                {formatDateTime(item.starts_at)}
                                            </Table.Td>

                                            <Table.Td>
                                                {formatDateTime(item.ends_at)}
                                            </Table.Td>

                                            <Table.Td>
                                                {item.reason || "Not specified"}
                                            </Table.Td>

                                            <Table.Td>
                                                <Button
                                                    className="doctor-btn"
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    leftSection={
                                                        <Trash2 size={14} />
                                                    }
                                                    loading={
                                                        deletingId === item.id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            "doctor_unavailability",
                                                            item.id,
                                                            "unavailable period"
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    Delete
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}

                                    {!loading && unavailable.length === 0 && (
                                        <Table.Tr>
                                            <Table.Td colSpan={4}>
                                                <Text
                                                    c="dimmed"
                                                    ta="center"
                                                    py="md"
                                                >
                                                    No unavailable periods added.
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}

                                    {loading && (
                                        <Table.Tr>
                                            <Table.Td colSpan={4}>
                                                <Text
                                                    c="dimmed"
                                                    ta="center"
                                                    py="md"
                                                >
                                                    Loading unavailable periods...
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Stack>
                </Paper>

                {/* Refresh */}
                <Group justify="flex-end">
                    <Button
                        className="doctor-btn doctor-btn-secondary"
                        variant="default"
                        leftSection={<RefreshCw size={16} />}
                        onClick={loadDoctorData}
                        loading={loading}
                        disabled={!doctorId}
                        type="button"
                    >
                        Refresh Schedule
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
}
