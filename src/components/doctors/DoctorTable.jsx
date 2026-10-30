import {
    ActionIcon,
    Avatar,
    Badge,
    Group,
    Table,
    Text,
    Tooltip,
} from "@mantine/core";
import { Pencil, Power, UserRound } from "lucide-react";

export default function DoctorTable({ doctors = [], loading, onEdit, onToggleStatus }) {
    if (loading && !doctors.length) {
        return <Text c="dimmed" ta="center" py="xl">Loading doctors...</Text>;
    }

    if (!doctors.length) {
        return (
            <Text c="dimmed" ta="center" py="xl">
                No doctors found. Try another search or add a doctor.
            </Text>
        );
    }

    return (
        <Table.ScrollContainer minWidth={760}>
            <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Doctor</Table.Th>
                        <Table.Th>Specialization</Table.Th>
                        <Table.Th>Experience</Table.Th>
                        <Table.Th>Consultation fee</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th ta="right">Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {doctors.map((doctor) => (
                        <Table.Tr key={doctor.id}>
                            <Table.Td>
                                <Group gap="sm" wrap="nowrap">
                                    <Avatar src={doctor.profile_image_url} color="teal" radius="md">
                                        <UserRound size={18} />
                                    </Avatar>
                                    <div>
                                        <Text size="sm" fw={700}>{doctor.full_name || "Unnamed doctor"}</Text>
                                        <Text size="xs" c="dimmed">{doctor.email || doctor.phone || "No contact details"}</Text>
                                    </div>
                                </Group>
                            </Table.Td>
                            <Table.Td><Text size="sm">{doctor.specialization || "—"}</Text></Table.Td>
                            <Table.Td><Text size="sm">{doctor.experience_years ?? 0} years</Text></Table.Td>
                            <Table.Td><Text size="sm" fw={600}>Rs. {Number(doctor.consultation_fee || 0).toLocaleString()}</Text></Table.Td>
                            <Table.Td>
                                <Badge color={doctor.is_active ? "teal" : "gray"} variant="light">
                                    {doctor.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Group justify="flex-end" gap={6}>
                                    <Tooltip label="Edit doctor">
                                        <ActionIcon variant="light" color="teal" onClick={() => onEdit(doctor)} aria-label={`Edit ${doctor.full_name}`}>
                                            <Pencil size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={doctor.is_active ? "Deactivate doctor" : "Reactivate doctor"}>
                                        <ActionIcon
                                            variant="light"
                                            color={doctor.is_active ? "orange" : "teal"}
                                            onClick={() => onToggleStatus(doctor)}
                                            aria-label={doctor.is_active ? `Deactivate ${doctor.full_name}` : `Reactivate ${doctor.full_name}`}
                                        >
                                            <Power size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
