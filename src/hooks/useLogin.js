
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPassword } from "../services/authService";

const useLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const profile = await loginWithPassword(email, password);

            if (profile.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (profile.role === "doctor") {
                navigate("/doctor/dashboard", { replace: true });
            }
        } catch (err) {
            setError(
                err.message || "Unable to sign in. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        submitting,
        handleSubmit,
    };
}


export default useLogin