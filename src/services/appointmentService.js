
import { supabase } from "../lib/supabase.jsx";

export async function completeDoctorAppointment(appointmentId) {
    const { error } = await supabase.rpc(
        "doctor_complete_appointment",
        {
            p_appointment_id: appointmentId,
        }
    );

    if (error) throw error;
}
// Get All Appointments
export async function getAppointments() {
    const { data, error } = await supabase
        .from("appointments")
        .select(`
            id,
            patient_id,
            doctor_id,
            starts_at,
            ends_at,
            status,
            consultation_fee,
            payment_status,
            patient_notes,
            created_at,
            patient:profiles!appointments_patient_id_fkey (
                full_name,
                email
            ),
            doctor:doctors!appointments_doctor_id_fkey (
                full_name,
                specialization
            )
        `)
        .order("starts_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
}

// FOr update AppointMent Status 
export async function updateAppointmentStatus(id, status) {
    const allowedStatuses = ["confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid appointment status.");
    }

    const { data, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}
