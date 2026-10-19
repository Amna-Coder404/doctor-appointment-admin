
import { Stethoscope, UserCheck, UserX } from "lucide-react";

export default function DoctorStats({ doctors }) {
    const active = doctors.filter((doctor) => doctor.is_active).length;
    const inactive = doctors.length - active;

    const stats = [
        { label: "Total Doctors", value: doctors.length, Icon: Stethoscope },
        { label: "Active", value: active, Icon: UserCheck },
        { label: "Inactive", value: inactive, Icon: UserX },
    ];

    return (
        <div className="doctor-stats">
            {stats.map(({ label, value, Icon }) => (
                <div className="doctor-stat-card" key={label}>
                    <span className="doctor-stat-icon">
                        <Icon size={21} />
                    </span>
                    <div>
                        <p>{label}</p>
                        <h3>{value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
