
import { supabase } from "../lib/supabase.jsx";

// Get Current User Profile
export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("id", userId)
        .single();

    if (error) throw error;

    return data;
};

// Login with Email and Password
export const loginWithPassword = async (email, password) => {
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

        return profile;
    } catch (error) {
        await supabase.auth.signOut();

        if (
            error.message ===
            "This account does not have access to the admin panel."
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
