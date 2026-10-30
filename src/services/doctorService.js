
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
            // Keep original error message.
        }

        throw new Error(message);
    }

    if (!data?.doctor) {
        throw new Error(
            data?.error || "The server did not return the doctor record."
        );
    }

    return data.doctor;
}

// Update an existing doctor.
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

// Update doctor account status.
export async function updateDoctorStatus(id, isActive) {
    return updateDoctor(id, { is_active: isActive });
}

// Doctor edits their own profile.
export async function updateMyDoctorProfile(userId, updates) {
    if (!userId) {
        throw new Error("Doctor user ID is missing. Please log in again.");
    }

    const allowedFields = [
        "full_name",
        "phone",
        "specialization",
        "qualification",
        "experience_years",
        "consultation_fee",
        "bio",
        "clinic_name",
        "clinic_address",
        "profile_image_url",
    ];

    const safeUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key, value]) =>
            allowedFields.includes(key) && value !== undefined
        )
    );

    if (Object.keys(safeUpdates).length === 0) {
        throw new Error("No valid profile changes were provided.");
    }

    const { data, error } = await supabase
        .from("doctors")
        .update({
            ...safeUpdates,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        throw new Error(
            "Doctor profile record not found. Please contact the administrator to link your doctor account."
        );
    }

    return data;
}

// Upload doctor profile photo.
export async function uploadDoctorImage(file) {
    if (!file) return null;

    if (!file.type?.startsWith("image/")) {
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
