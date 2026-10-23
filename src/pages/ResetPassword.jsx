
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.jsx";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [checking, setChecking] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [sessionReady, setSessionReady] = useState(false);

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
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError) throw sessionError;
            if (!sessionData.session) {
                throw new Error("Your invitation session expired. Request a new invitation.");
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) throw updateError;

            setMessage("Password set successfully. You can now log in.");

            await supabase.auth.signOut();
            window.setTimeout(() => navigate("/login"), 1500);
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
            <form onSubmit={handleSubmit} className="reset-password-card">
                <h1>Set your password</h1>
                <p>Create a password for your doctor account.</p>

                {error && <p role="alert" className="form-error">{error}</p>}
                {message && <p role="status" className="form-success">{message}</p>}

                {sessionReady ? (
                    <>
                        <label htmlFor="password">New password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <label htmlFor="confirm-password">Confirm password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />

                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Set password"}
                        </button>
                    </>
                ) : (
                    <p>
                        This link could not be verified. Ask the admin to send a new
                        invitation after the account has been checked.
                    </p>
                )}
            </form>
        </main>
    );
}
