import { Plus, RefreshCw, Search } from "lucide-react";
import {
    Alert,
    Button,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";

import useDoctors from "../hooks/useDoctors";
import DoctorStats from "../components/doctors/DoctorStats";
import DoctorTable from "../components/doctors/DoctorTable";
import DoctorModal from "../components/doctors/DoctorModal";
import PageHeader from "../components/ui/PageHeader";

export default function DoctorsManagement() {
    const {
        doctors,
        filteredDoctors,
        loading,
        saving,
        error,
        formError,
        search,
        setSearch,
        filter,
        setFilter,
        editingDoctor,
        formOpen,
        form,
        fetchDoctors,
        openAdd,
        openEdit,
        closeModal,
        handleSave,
        handleToggleStatus,
    } = useDoctors();

    return (
        <Stack gap="xl">
            <PageHeader
                eyebrow="ADMINISTRATION"
                title="Doctors management"
                subtitle="Create doctor accounts and manage professional information."
                action={
                    <Button onClick={openAdd} leftSection={<Plus size={17} />}>
                        Add doctor
                    </Button>
                }
            />

            {error && <Alert color="red" title="Something went wrong">{error}</Alert>}

            <DoctorStats doctors={doctors} />

            <Paper withBorder radius="lg" p={{ base: "md", sm: "lg" }}>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Stack gap={3}>
                            <Text fw={700}>All doctors</Text>
                            <Text size="xs" c="dimmed">
                                {filteredDoctors.length} of {doctors.length} doctors
                            </Text>
                        </Stack>
                        <Button
                            variant="light"
                            color="gray"
                            leftSection={<RefreshCw size={16} />}
                            onClick={fetchDoctors}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </Group>

                    <Group align="flex-end" grow>
                        <TextInput
                            leftSection={<Search size={17} />}
                            placeholder="Search name, specialization or email"
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                        />
                        <Select
                            label="Account status"
                            data={[
                                { value: "all", label: "All doctors" },
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                            value={filter || "all"}
                            onChange={setFilter}
                            allowDeselect={false}
                            w={{ base: "100%", sm: 190 }}
                            flex="0 0 190px"
                        />
                    </Group>

                    <DoctorTable
                        doctors={filteredDoctors}
                        loading={loading}
                        onEdit={openEdit}
                        onToggleStatus={handleToggleStatus}
                    />
                </Stack>
            </Paper>

            {formOpen && (
                <DoctorModal
                    doctor={editingDoctor}
                    initialForm={form}
                    saving={saving}
                    formError={formError}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </Stack>
    );
}
