
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.jsx";
import useAuth from "../hooks/useAuth";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [checking, setChecking] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [sessionReady, setSessionReady] = useState(false);

    const { changePassword, logout } = useAuth();

    useEffect(() => {
        let active = true;

        async function verifyInvitation() {
            try {
                const params = new URLSearchParams(window.location.search);
                const tokenHash = params.get("token_hash");
                const type = params.get("type");

                if (tokenHash && (type === "invite" || type === "recovery")) {
                    const { error: verifyError } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type,
                    });

                    if (verifyError) throw verifyError;
                }

                const { data, error: sessionError } =
                    await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (!data.session) {
                    throw new Error(
                        "This invitation link is invalid or expired. Ask the admin to send a new invitation."
                    );
                }

                // Remove authentication tokens from the visible URL after verification.
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

                if (active) setSessionReady(true);
            } catch (err) {
                if (active) {
                    setError(err?.message || "Could not verify this invitation.");
                }
            } finally {
                if (active) setChecking(false);
            }
        }

        verifyInvitation();

        return () => {
            active = false;
        };
    }, []);


    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSaving(true);

        try {
            const { data, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            if (!data.session) {
                throw new Error(
                    "Your invitation session expired. Request a new invitation."
                );
            }

            // Reuse the password-update function from useAuth.
            await changePassword(password);

            setMessage("Password set successfully. You can now log in.");

            await logout();
        } catch (err) {
            setError(err?.message || "Could not set your password.");
        } finally {
            setSaving(false);
        }
    }


    if (checking) {
        return <main className="reset-password-page">Verifying invitation...</main>;
    }

    return (
        <main className="reset-password-page">
            {error && !sessionReady ? (
                <p role="alert" className="form-error">{error}</p>
            ) : sessionReady ? (
                <ChangePasswordForm
                    mode="reset"
                    onSuccess={async () => {
                        await supabase.auth.signOut();
                        navigate("/login", { replace: true });
                    }}
                />
            ) : (
                <p>This invitation link could not be verified.</p>
            )}
        </main>
    );
}
