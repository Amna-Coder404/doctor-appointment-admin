
import { supabase } from "../lib/supabase.jsx";

const TABLE = "notifications";

export async function getNotifications(recipientId, recipientRole) {
    if (!recipientId || !recipientRole) return [];

    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("recipient_id", recipientId)
        .eq("recipient_role", recipientRole)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
}

export async function getUnreadNotificationCount(
    recipientId,
    recipientRole
) {
    if (!recipientId || !recipientRole) return 0;

    const { count, error } = await supabase
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", recipientId)
        .eq("recipient_role", recipientRole)
        .eq("is_read", false);

    if (error) throw error;

    return count ?? 0;
}

export async function markNotificationAsRead(
    notificationId,
    recipientId,
    recipientRole
) {
    const { error } = await supabase
        .from(TABLE)
        .update({
            is_read: true,
            read_at: new Date().toISOString(),
        })
        .eq("id", notificationId)
        .eq("recipient_id", recipientId)
        .eq("recipient_role", recipientRole)
        .eq("is_read", false);

    if (error) throw error;
}

export async function markAllNotificationsAsRead(
    recipientId,
    recipientRole
) {
    const { error } = await supabase
        .from(TABLE)
        .update({
            is_read: true,
            read_at: new Date().toISOString(),
        })
        .eq("recipient_id", recipientId)
        .eq("recipient_role", recipientRole)
        .eq("is_read", false);

    if (error) throw error;
}
