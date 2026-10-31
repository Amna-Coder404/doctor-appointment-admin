
import { supabase } from "../lib/supabase.jsx";

// Get Current User Profile

export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, avatar_url, role")
        .eq("id", userId)
        .single();

    if (error) throw error;

    let doctor = null;

    if (data.role === "doctor") {
        const { data: doctorData, error: doctorError } = await supabase
            .from("doctors")
            .select("id, full_name, specialization, profile_image_url, user_id")
            .eq("user_id", userId)
            .maybeSingle();

        if (doctorError) throw doctorError;

        doctor = doctorData;
    }

    return { ...data, doctor };
};


// Login with Email and Password
// Login with Email, Password and Role
export const loginWithPassword = async (email, password, selectedRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
    });

    if (error) throw error;

    try {
        const profile = await getProfile(data.user.id);

        // Allow only admin and doctor accounts
        if (!["admin", "doctor"].includes(profile.role)) {
            throw new Error(
                "This account does not have access to the admin panel."
            );
        }

        // Verify selected role against actual database role
        if (profile.role !== selectedRole) {
            throw new Error(
                `This account is registered as ${profile.role}, not ${selectedRole}.`
            );
        }

        return profile;
    } catch (error) {
        await supabase.auth.signOut();

        if (
            error.message ===
            "This account does not have access to the admin panel." ||
            error.message.startsWith("This account is registered as")
        ) {
            throw error;
        }

        throw new Error("Your user profile was not found.");
    }
};

// Get Current Session
export const getCurrentSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session;
};

// Sign Out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
};


// Update Password


export const updatePassword = async (currentPassword, newPassword) => {
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    const user = data.session?.user;

    if (!user?.email) {
        throw new Error("Please log in again to change your password.");
    }

    // Verify the current password by re-authenticating.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });

    if (verifyError) {
        throw new Error("Your current password is incorrect.");
    }

    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) throw updateError;
};
