
export const DAYS = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
];


export function formatTime(time) {
    return time?.slice(0, 5) || "";
}

export function formatDateTime(value) {
    if (!value) return "—";

    return new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
}