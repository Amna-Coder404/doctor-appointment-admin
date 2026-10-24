
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.jsx";

import { getCurrentSession, getProfile, signOut, updatePassword, } from "../services/authService";

const useAuth = () => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Load the current user's profile
    const loadUserProfile = useCallback(async (userId) => {
        try {
            const userProfile = await getProfile(userId);
            setProfile(userProfile);
            return userProfile;
        } catch (error) {
            console.error("Could not load profile:", error.message);
            setProfile(null);
            return null;
        }
    }, []);

    // Refresh session and profile
    const refreshProfile = useCallback(async () => {
        try {
            const currentSession = await getCurrentSession();

            setSession(currentSession);

            if (currentSession?.user) {
                return await loadUserProfile(currentSession.user.id);
            }

            setProfile(null);
            return null;
        } catch (error) {
            console.error("Could not refresh profile:", error.message);
            setProfile(null);
            return null;
        }
    }, [loadUserProfile]);

    // Initialize authentication and listen for auth changes
    useEffect(() => {
        let active = true;

        const initialize = async () => {
            try {
                const currentSession = await getCurrentSession();

                if (!active) return;

                setSession(currentSession);

                let userProfile = null;

                if (currentSession?.user) {
                    userProfile = await getProfile(currentSession.user.id);
                }

                if (active) {
                    setProfile(userProfile);
                }
            } catch (error) {
                console.error(
                    "Authentication initialization failed:",
                    error.message
                );

                if (active) {
                    setSession(null);
                    setProfile(null);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        initialize();

        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (!active) return;

            setSession(newSession);

            if (!newSession?.user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            // Load the profile after the auth callback finishes
            Promise.resolve().then(async () => {
                try {
                    const userProfile = await getProfile(newSession.user.id);

                    if (active) setProfile(userProfile);
                } catch (error) {
                    console.error("Could not load profile:", error.message);

                    if (active) setProfile(null);
                } finally {
                    if (active) setLoading(false);
                }
            });
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    // Sign out
    const logout = async () => {
        try {
            await signOut();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Sign out failed:", error.message);
        }
    };

    // Change Password
    const changePassword = async (currentPassword, newPassword) => {
        await updatePassword(currentPassword, newPassword);
    };
    return {
        session,
        profile,
        loading,
        refreshProfile,
        logout,
        changePassword
    };
};

export default useAuth;
