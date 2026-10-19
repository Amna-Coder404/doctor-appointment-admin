
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase.jsx'

export default function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            const { data, error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                })

            if (loginError) throw loginError

            const { data: profile, error: profileError } =
                await supabase
                    .from('profiles')
                    .select('id, full_name, role')
                    .eq('id', data.user.id)
                    .single()

            if (profileError || !profile) {
                await supabase.auth.signOut()
                throw new Error('Your user profile was not found.')
            }

            if (profile.role === 'admin') {
                navigate('/admin/dashboard', { replace: true })
            } else if (profile.role === 'doctor') {
                navigate('/doctor/dashboard', { replace: true })
            } else {
                await supabase.auth.signOut()
                throw new Error(
                    'This account does not have access to the admin panel.'
                )
            }
        } catch (err) {
            setError(err.message || 'Unable to sign in. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="login-page">
            <section className="login-brand">
                <div className="brand-logo">
                    <Activity size={28} />
                </div>

                <div>
                    <p className="brand-label">HEALTHCARE MANAGEMENT</p>
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
                <form className="login-card" onSubmit={handleSubmit}>
                    <span className="eyebrow">WELCOME BACK</span>
                    <h2>Sign in to your account</h2>
                    <p className="login-subtitle">
                        Enter your work credentials to continue.
                    </p>

                    <label htmlFor="email">Email address</label>
                    <div className="input-wrap">
                        <Mail size={18} />
                        <input
                            id="email"
                            type="email"
                            placeholder="you@clinic.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <label htmlFor="password">Password</label>
                    <div className="input-wrap">
                        <LockKeyhole size={18} />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in...' : 'Sign in'}
                    </button>

                    <p className="login-note">
                        Access is restricted to authorized administrators and doctors.
                    </p>
                </form>
            </section>
        </main>
    )
}
