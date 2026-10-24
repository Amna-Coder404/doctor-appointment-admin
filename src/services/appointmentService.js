
import { supabase } from "../lib/supabase.jsx";

export async function completeDoctorAppointment(appointmentId) {
    return updateDoctorAppointmentStatus(appointmentId, "completed");
}

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

// Existing admin operation. Keep admin access restricted by RLS.
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

export async function getDoctorProfile(userId) {
    const { data, error } = await supabase
        .from("doctors")
        .select("id, full_name, specialization, profile_image_url")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function getDoctorAppointments(doctorId) {
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
            )
        `)
        .eq("doctor_id", doctorId)
        .order("starts_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
}

export async function updateDoctorAppointmentStatus(appointmentId, status) {
    const { error } = await supabase.rpc(
        "doctor_update_appointment_status",
        {
            p_appointment_id: appointmentId,
            p_status: status,
        }
    );

    if (error) throw error;
}
