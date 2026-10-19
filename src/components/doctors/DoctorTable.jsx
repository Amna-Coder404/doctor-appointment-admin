
import { Pencil, Power, UserRound } from "lucide-react";

export default function DoctorTable({
    doctors,
    loading,
    onEdit,
    onToggleStatus,
}) {

    if (loading) {
        return <div className="doctor-message">Loading doctors...</div>;
    }

    if (!doctors.length) {
        return (
            <div className="doctor-empty">
                <UserRound size={34} />
                <h3>No doctors found</h3>
                <p>Try another search or add a doctor.</p>
            </div>
        );
    }

    return (
        <div className="doctor-table-wrapper">
            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Doctor</th>
                        <th>Specialization</th>
                        <th>Experience</th>
                        <th>Fee</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>
                                <div className="doctor-identity">
                                    {doctor.profile_image_url ? (
                                        <img
                                            className="doctor-avatar"
                                            src={doctor.profile_image_url}
                                            alt=""
                                        />
                                    ) : (
                                        <span className="doctor-avatar doctor-avatar-placeholder">
                                            <UserRound size={21} />
                                        </span>
                                    )}

                                    <div className="doctor-identity-info">
                                        <strong>{doctor.full_name}</strong>
                                        <span>{doctor.email || doctor.phone || "No contact"}</span>
                                    </div>
                                </div>
                            </td>

                            <td>{doctor.specialization}</td>
                            <td>{doctor.experience_years} years</td>
                            <td className="doctor-fee">
                                Rs. {Number(doctor.consultation_fee).toLocaleString()}
                            </td>

                            <td>
                                <span
                                    className={`doctor-status ${doctor.is_active ? "active" : "inactive"
                                        }`}
                                >
                                    {doctor.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td>
                                <div className="doctor-actions">
                                    <button
                                        type="button"
                                        className="doctor-icon-btn"
                                        onClick={() => onEdit(doctor)}
                                        aria-label={`Edit ${doctor.full_name}`}
                                        title="Edit doctor"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        className={`doctor-icon-btn ${doctor.is_active ? "deactivate" : "activate"
                                            }`}
                                        onClick={() => onToggleStatus(doctor)}
                                        aria-label={
                                            doctor.is_active
                                                ? `Deactivate ${doctor.full_name}`
                                                : `Reactivate ${doctor.full_name}`
                                        }
                                        title={doctor.is_active ? "Deactivate" : "Reactivate"}
                                    >
                                        <Power size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
