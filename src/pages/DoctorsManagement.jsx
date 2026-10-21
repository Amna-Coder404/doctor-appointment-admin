
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCw, Search } from "lucide-react";

import useDoctors from "../hooks/useDoctors";
import DoctorStats from "../components/doctors/DoctorStats";
import DoctorTable from "../components/doctors/DoctorTable";
import DoctorModal from "../components/doctors/DoctorModal";
import "../styles/DoctorsManagement.css";

export default function DoctorsManagement() {
    const navigate = useNavigate();

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
        <main className="doctors-page">
            <header className="doctors-header">
                <div>

                    <h1>Doctors Management</h1>
                    <p>Manage doctor profiles and availability.</p>
                </div>

                <button className="doctor-btn doctor-btn-primary" onClick={openAdd}>
                    <Plus size={18} /> Add Doctor
                </button>
            </header>

            <DoctorStats doctors={doctors} />

            <section className="doctors-panel">
                <div className="doctors-toolbar">
                    <div className="doctor-search">
                        <Search size={18} />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search doctors..."
                            aria-label="Search doctors"
                        />
                    </div>

                    <div className="doctor-toolbar-actions">
                        <select
                            value={filter ?? "all"}
                            onChange={(event) => setFilter(event.target.value)}
                            aria-label="Filter doctors by status"
                        >
                            <option value="all">All doctors</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            className="doctor-btn doctor-btn-secondary"
                            onClick={fetchDoctors}
                            disabled={loading}
                            title="Refresh doctors"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                {error && <div className="doctor-error">{error}</div>}

                <DoctorTable
                    doctors={filteredDoctors}
                    loading={loading}
                    onEdit={openEdit}
                    onToggleStatus={handleToggleStatus}
                />

                <footer className="doctors-footer">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                </footer>
            </section>

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
        </main>
    );
}
