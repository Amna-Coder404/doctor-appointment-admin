
import { supabase } from "../lib/supabase.jsx";

// Get Current Doctor (auth )
export async function getDoctors() {
    const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

// Add a New Doctor and there by defult status true (mean Active)
export async function addDoctor(doctor) {
    const { data, error } = await supabase
        .from("doctors")
        .insert({
            ...doctor,
            is_active: true,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

//Update the doctor Info  
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

// Update the doctor status mean what the doctor active or not
export async function updateDoctorStatus(id, isActive) {
    return updateDoctor(id, { is_active: isActive });
}



// Selete and Upload Doctor image
export async function uploadDoctorImage(file) {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
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
