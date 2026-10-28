
import { supabase } from "../lib/supabase.jsx";

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

// Admin: update appointment status.
export async function updateAppointmentStatus(id, status) {
    const allowedStatuses = ["confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid appointment status.");
    }

    const updates = { status };

    // Assumes payment has been received when an appointment is completed.
    if (status === "completed") {
        updates.payment_status = "paid";
    }

    const { data, error } = await supabase
        .from("appointments")
        .update(updates)
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
                id,
                full_name,
                email
            )
        `)
        .eq("doctor_id", doctorId)
        .order("starts_at", { ascending: true });

    if (error) {
        console.error("Doctor appointments query error:", error);
        throw error;
    }

    return data ?? [];
}

// Doctor: update status through the existing secure database RPC.
export async function updateDoctorAppointmentStatus(
    appointmentId,
    status
) {
    const allowedStatuses = ["confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid appointment status.");
    }

    const { error } = await supabase.rpc(
        "doctor_update_appointment_status",
        {
            p_appointment_id: appointmentId,
            p_status: status,
        }
    );

    if (error) throw error;
}

export async function completeDoctorAppointment(appointmentId) {
    return updateDoctorAppointmentStatus(appointmentId, "completed");
}
