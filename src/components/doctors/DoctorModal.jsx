
import { X, Stethoscope } from "lucide-react";
import DoctorForm from "./DoctorForm";

export default function DoctorModal({ doctor, initialForm, saving, formError, onSave, onClose,
}) {

    return (
        <div
            className="doctor-modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !saving) {
                    onClose();
                }
            }}
        >
            <section
                className="doctor-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="doctor-modal-title"
            >
                <header className="doctor-modal-header">
                    <div className="doctor-modal-heading">
                        <span className="doctor-modal-icon">
                            <Stethoscope size={22} />
                        </span>
                        <div>
                            <h2 id="doctor-modal-title">
                                {doctor ? "Edit Doctor" : "Add Doctor"}
                            </h2>
                            <p>Enter the doctor's information below.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="doctor-close-btn"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </header>

                <DoctorForm
                    key={doctor?.id || "new-doctor"}
                    initialForm={initialForm}
                    saving={saving}
                    formError={formError}
                    onSave={onSave}
                    onCancel={onClose}
                />
            </section>
        </div>
    );
}
