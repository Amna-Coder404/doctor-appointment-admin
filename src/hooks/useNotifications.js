
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.jsx";

import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../services/notificationService";

export function useNotifications(recipientId, recipientRole) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const refreshNotifications = useCallback(async () => {
        if (!recipientId || !recipientRole) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [data, count] = await Promise.all([
                getNotifications(recipientId, recipientRole),
                getUnreadNotificationCount(recipientId, recipientRole),
            ]);

            setNotifications(data);
            setUnreadCount(count);
        } catch (err) {
            setError(err.message || "Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    }, [recipientId, recipientRole]);

    const markAsRead = useCallback(async (notificationId) => {
        if (!recipientId || !recipientRole || !notificationId) return;

        const notification = notifications.find(
            (item) => item.id === notificationId
        );

        if (!notification || notification.is_read) return;

        setNotifications((previous) =>
            previous.map((item) =>
                item.id === notificationId
                    ? { ...item, is_read: true }
                    : item
            )
        );

        setUnreadCount((previous) => Math.max(0, previous - 1));

        try {
            await markNotificationAsRead(
                notificationId,
                recipientId,
                recipientRole
            );
        } catch (err) {
            await refreshNotifications();
            setError(err.message || "Unable to mark notification as read.");
            throw err;
        }
    }, [recipientId, recipientRole, notifications, refreshNotifications]);

    const markAllAsRead = useCallback(async () => {
        if (!recipientId || !recipientRole || unreadCount === 0) return;

        setNotifications((previous) =>
            previous.map((item) => ({ ...item, is_read: true }))
        );

        setUnreadCount(0);

        try {
            await markAllNotificationsAsRead(recipientId, recipientRole);
        } catch (err) {
            await refreshNotifications();
            setError(err.message || "Unable to mark notifications as read.");
            throw err;
        }
    }, [recipientId, recipientRole, unreadCount, refreshNotifications]);

    useEffect(() => {
        if (!recipientId || !recipientRole) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        refreshNotifications();

        const channel = supabase
            .channel(`notifications-${recipientRole}-${recipientId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                    filter: `recipient_id=eq.${recipientId}`,
                },
                () => {
                    refreshNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [recipientId, recipientRole, refreshNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
    };
}
