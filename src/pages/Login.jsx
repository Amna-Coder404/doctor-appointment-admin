
import { Activity, Mail, LockKeyhole, Eye, EyeOff, } from "lucide-react";
import { Alert, Button, Paper, PasswordInput, Text, TextInput, Title, } from "@mantine/core";
import useLogin from "../hooks/useLogin";



export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        submitting,
        handleSubmit,
    } = useLogin();

    return (
        <main className="login-page">
            <section className="login-brand">
                <div className="brand-logo">
                    <Activity size={28} />
                </div>

                <div>
                    <p className="brand-label">
                        HEALTHCARE MANAGEMENT
                    </p>

                    <h1>Doctor Appointment</h1>

                    <p className="brand-description">
                        One workspace for doctors, appointments and better care.
                    </p>
                </div>

                <div className="brand-footer">
                    Secure access for authorized clinic staff.
                </div>
            </section>

            <section className="login-side">
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    className="login-card"
                    radius="lg"
                    shadow="sm"
                >
                    <span className="eyebrow">WELCOME BACK</span>

                    <Title order={2}>
                        Sign in to your account
                    </Title>

                    <Text className="login-subtitle" c="dimmed">
                        Enter your work credentials to continue.
                    </Text>

                    <TextInput
                        label="Email address"
                        placeholder="you@clinic.com"
                        type="email"
                        leftSection={<Mail size={18} />}
                        leftSectionPointerEvents="none"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.currentTarget.value)
                        }
                        autoComplete="username"
                        required
                        size="md"
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        leftSection={<LockKeyhole size={18} />}
                        leftSectionPointerEvents="none"
                        visibilityToggleIcon={({ reveal }) =>
                            reveal ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )
                        }
                        value={password}
                        onChange={(event) =>
                            setPassword(event.currentTarget.value)
                        }
                        autoComplete="current-password"
                        required
                        size="md"
                    />

                    {error && (
                        <Alert
                            color="red"
                            variant="light"
                            role="alert"
                            title="Sign-in failed"
                        >
                            {error}
                        </Alert>
                    )}

                    <Button
                        className="login-button"
                        type="submit"
                        fullWidth
                        loading={submitting}
                        disabled={!email.trim() || !password}
                        size="md"
                    >
                        Sign in
                    </Button>

                    <Text
                        className="login-note"
                        size="sm"
                        c="dimmed"
                        ta="center"
                    >
                        Access is restricted to authorized administrators
                        and doctors.
                    </Text>
                </Paper>
            </section>
        </main>
    );
}
