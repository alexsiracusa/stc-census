

export const findStartAndEndDates = (tasks: any) => {
    const taskArray = Object.values(tasks);
    const startDate = tasks[0].target_start_date;
    const endDate = tasks[taskArray.length - 1].target_completion_date;

    return { startDate, endDate };
};
