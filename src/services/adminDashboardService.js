
import { supabase } from "../lib/supabase.jsx";

export async function getAdminDashboardStats() {
    const [doctors, appointments, pending] = await Promise.all([
        supabase
            .from("doctors")
            .select("id", { count: "exact", head: true }),

        supabase
            .from("appointments")
            .select("id", { count: "exact", head: true }),

        supabase
            .from("appointments")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),
    ]);

    if (doctors.error) throw doctors.error;
    if (appointments.error) throw appointments.error;
    if (pending.error) throw pending.error;

    return {
        doctors: doctors.count ?? 0,
        appointments: appointments.count ?? 0,
        pending: pending.count ?? 0,
    };
}
