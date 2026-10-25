
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    HeartPulse,
    LockKeyhole,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";
import { Button, Loader } from "@mantine/core";

import { supabase } from "../lib/supabase.jsx";
import ChangePasswordForm from "../components/ChangePasswordForm";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [checking, setChecking] = useState(true);
    const [error, setError] = useState("");
    const [sessionReady, setSessionReady] = useState(false);

    useEffect(() => {
        let active = true;

        async function verifyInvitation() {
            try {
                const params = new URLSearchParams(window.location.search);
                const tokenHash = params.get("token_hash");
                const type = params.get("type");

                if (tokenHash && (type === "invite" || type === "recovery")) {
                    const { error: verifyError } =
                        await supabase.auth.verifyOtp({
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

                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

                if (active) {
                    setSessionReady(true);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    setError(
                        err?.message ||
                        "Could not verify your invitation."
                    );
                    setSessionReady(false);
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

    async function handleSuccess() {
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
    }

    return (
        <main className="reset-page">
            <div className="reset-background reset-background-one" />
            <div className="reset-background reset-background-two" />

            <header className="reset-topbar">
                <button
                    type="button"
                    className="reset-brand"
                    onClick={() => navigate("/login")}
                    aria-label="MediBook login"
                >
                    <span className="reset-brand-icon">
                        <HeartPulse size={23} />
                    </span>

                    <span>
                        <strong>MediBook</strong>
                        <small>Healthcare management</small>
                    </span>
                </button>

                <div className="reset-secure-label">
                    <ShieldCheck size={17} />
                    <span>Secure account setup</span>
                </div>
            </header>

            <section className="reset-content">
                <div className="reset-intro">
                    <div className="reset-icon">
                        <LockKeyhole size={27} />
                    </div>

                    <p className="reset-eyebrow">
                        DOCTOR ACCOUNT SECURITY
                    </p>

                    <h1>
                        Your account,
                        <br />
                        <span>your security.</span>
                    </h1>

                    <p className="reset-description">
                        Create a secure password to access your MediBook
                        doctor dashboard and manage your appointments.
                    </p>

                    <div className="reset-benefits">
                        <div className="reset-benefit">
                            <span className="reset-benefit-icon">
                                <ShieldCheck size={19} />
                            </span>
                            <div>
                                <strong>Secure access</strong>
                                <p>Protect your professional account.</p>
                            </div>
                        </div>

                        <div className="reset-benefit">
                            <span className="reset-benefit-icon">
                                <Stethoscope size={19} />
                            </span>
                            <div>
                                <strong>Doctor workspace</strong>
                                <p>Manage your clinic activities in one place.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="reset-panel">
                    {checking ? (
                        <div className="reset-status">
                            <span className="reset-status-icon">
                                <Loader color="teal" size="lg" />
                            </span>
                            <h2>Verifying your invitation</h2>
                            <p>
                                Please wait while we securely verify your
                                invitation link.
                            </p>
                        </div>
                    ) : sessionReady ? (
                        <div className="reset-form-wrapper">
                            <div className="reset-panel-heading">
                                <span className="reset-panel-icon">
                                    <LockKeyhole size={21} />
                                </span>

                                <div>
                                    <h2>Set your password</h2>
                                    <p>
                                        Choose a strong password for your account.
                                    </p>
                                </div>
                            </div>

                            <div className="reset-form">
                                <ChangePasswordForm
                                    mode="reset"
                                    onSuccess={handleSuccess}
                                />
                            </div>

                            <div className="reset-security-note">
                                <ShieldCheck size={17} />
                                <span>
                                    Use at least 8 characters for your password.
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="reset-status reset-error-state">
                            <span className="reset-status-icon">
                                <ShieldCheck size={27} />
                            </span>

                            <h2>Invitation unavailable</h2>

                            <p>
                                {error ||
                                    "We could not verify this invitation."}
                            </p>

                            <p>
                                Ask your administrator to check your doctor
                                account and send a new invitation.
                            </p>

                            <Button
                                color="teal"
                                radius="md"
                                leftSection={<ArrowLeft size={16} />}
                                onClick={() => navigate("/login")}
                            >
                                Back to login
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <footer className="reset-footer">
                <span>
                    <ShieldCheck size={15} />
                    Your account security matters
                </span>
                <span>© {new Date().getFullYear()} MediBook</span>
            </footer>
        </main>
    );
}
