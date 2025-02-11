

export const findStartAndEndDates = (tasks: any) => {
    const taskArray = Object.values(tasks);
    const startDate = new Date(tasks[0].target_start_date);
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date(tasks[taskArray.length - 1].target_completion_date);
    endDate.setDate(endDate.getDate() + 1);
    
    return { startDate, endDate };
};
