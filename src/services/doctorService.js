
import { supabase } from "../lib/supabase.jsx";

// Get all doctor profiles.
export async function getDoctors() {
    const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

// Create a real doctor account through the secure Edge Function.

export async function createDoctorAccount(doctor) {
    const { data, error } = await supabase.functions.invoke(
        "create-doctor-account",
        { body: { doctor } }
    );

    if (error) {
        let message = error.message || "Could not create doctor account.";

        try {
            const response = error.context;
            if (response && typeof response.clone === "function") {
                const body = await response.clone().json();
                message = body?.error || body?.message || message;
            }
        } catch {
            // Keep the original error message if the response isn't JSON.
        }

        throw new Error(message);
    }

    if (!data?.doctor) {
        throw new Error(data?.error || "The server did not return the doctor record.");
    }

    return data.doctor;
}


// Update an existing doctor without creating another login.
export async function updateDoctor(id, updates) {
    const { data, error } = await supabase
        .from("doctors")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateDoctorStatus(id, isActive) {
    return updateDoctor(id, { is_active: isActive });
}

// Upload a doctor profile photo.
export async function uploadDoctorImage(file) {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be 5 MB or less.");
    }

    const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from("doctor-photos")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from("doctor-photos")
        .getPublicUrl(filePath);

    return data.publicUrl;
}
