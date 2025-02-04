export const formatDateInLocal = (date: Date) => {
    return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: true,
    });
};