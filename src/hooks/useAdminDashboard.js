
import { useCallback, useEffect, useState } from "react";
import { getAdminDashboardStats } from "../services/adminDashboardService";

const initialStats = {
    doctors: 0,
    appointments: 0,
    pending: 0,
};

export default function useAdminDashboard() {
    const [stats, setStats] = useState(initialStats);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAdminDashboardStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to load dashboard stats:", err.message);
            setError("Unable to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return {
        stats,
        loading,
        error,
        refreshStats: loadStats,
    };
}
