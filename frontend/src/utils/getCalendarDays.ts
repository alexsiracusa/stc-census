
const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const getEndOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const getCalendarDays = (date: Date) => {
    const startOfMonth = getStartOfMonth(date);
    const endOfMonth = getEndOfMonth(date);
    const days = [];
    const firstDayOfWeek = startOfMonth.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
        const prevDay = new Date(startOfMonth);
        prevDay.setDate(prevDay.getDate() - firstDayOfWeek + i);
        days.push({date: prevDay, isCurrentMonth: false});
    }

    for (let i = 1; i <= endOfMonth.getDate(); i++) {
        days.push({
            date: new Date(date.getFullYear(), date.getMonth(), i),
            isCurrentMonth: true,
        });
    }

    const remainingDays = (7 - (days.length % 7)) % 7;
    const lastDay = new Date(endOfMonth);
    for (let i = 1; i <= remainingDays; i++) {
        const nextDay = new Date(lastDay);
        nextDay.setDate(lastDay.getDate() + i);
        days.push({date: nextDay, isCurrentMonth: false});
    }

    return days;
};

export default getCalendarDays;