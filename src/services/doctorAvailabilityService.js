
import { supabase } from "../lib/supabase.jsx";

export async function fetchDoctors() {
    const { data, error } = await supabase
        .from("doctors")
        .select("id, full_name, specialization, is_active")
        .order("full_name");

    if (error) throw error;

    return data || [];
}

export async function fetchDoctorAvailability(doctorId) {
    const { data, error } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("day_of_week")
        .order("start_time");

    if (error) throw error;

    return data || [];
}

export async function fetchDoctorUnavailability(doctorId) {
    const { data, error } = await supabase
        .from("doctor_unavailability")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("starts_at", { ascending: false });

    if (error) throw error;

    return data || [];
}

export async function addDoctorSchedule(doctorId, schedule) {
    const { error } = await supabase
        .from("doctor_availability")
        .insert({
            doctor_id: doctorId,
            day_of_week: Number(schedule.day_of_week),
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            slot_duration_minutes: Number(
                schedule.slot_duration_minutes
            ),
            is_active: true,
        });

    if (error) throw error;
}

export async function addDoctorUnavailability(doctorId, leave) {
    const { error } = await supabase
        .from("doctor_unavailability")
        .insert({
            doctor_id: doctorId,
            starts_at: new Date(leave.starts_at).toISOString(),
            ends_at: new Date(leave.ends_at).toISOString(),
            reason: leave.reason.trim() || null,
        });

    if (error) throw error;
}

export async function deleteDoctorAvailability(table, id, doctorId
) {
    if (
        !["doctor_availability", "doctor_unavailability"].includes(table)
    ) {
        throw new Error("Invalid availability table.");
    }

    const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .eq("doctor_id", doctorId);

    if (error) throw error;
}
