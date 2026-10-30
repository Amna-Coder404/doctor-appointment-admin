import { Modal } from "@mantine/core";
import DoctorForm from "./DoctorForm";

export default function DoctorModal({
    doctor,
    initialForm,
    saving,
    formError,
    onSave,
    onClose,
}) {
    return (
        <Modal
            opened
            onClose={onClose}
            title={doctor ? "Edit doctor" : "Add a doctor"}
            centered
            size="xl"
            radius="lg"
            overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
            closeOnClickOutside={!saving}
            closeOnEscape={!saving}
        >
            <DoctorForm
                key={doctor?.id || "new-doctor"}
                initialForm={initialForm}
                saving={saving}
                formError={formError}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
}
