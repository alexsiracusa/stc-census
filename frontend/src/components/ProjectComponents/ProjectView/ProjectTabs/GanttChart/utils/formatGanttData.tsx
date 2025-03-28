import {Task} from "../../../../../../types/Task.ts";
import {TaskStatusInfo} from "../../../../../../types/TaskStatuses.ts";

const formatGanttData = (tasks: Task[]) => {
    const formattedData = {
        labels: [],
        datasets: [],
    };

    const taskArray = Object.values(tasks);

    taskArray.forEach((task) => {
        const startDate = new Date(task.target_start_date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(task.target_completion_date);
        endDate.setHours(23, 59, 59, 999);

        formattedData.labels.push(task.name);

        let backgroundColor;
        let borderColor;

        switch (task.status) {
            case 'to_do':
                backgroundColor = TaskStatusInfo[task.status].color;
                borderColor = 'rgba(145, 145, 145, 0.3)';
                break;
            case 'in_progress':
                backgroundColor = TaskStatusInfo[task.status].color;
                borderColor = 'rgba(0, 83, 186, 0.3)';
                break;
            case 'on_hold':
                backgroundColor = TaskStatusInfo[task.status].color;
                borderColor = 'rgba(224, 176, 0, 0.3)';
                break;
            case 'done':
                backgroundColor = TaskStatusInfo[task.status].color;
                borderColor = 'rgba(0, 138, 30, 0.3)';
                break;
            default:
                backgroundColor = 'rgba(225, 26, 104, 0.8)';
                borderColor = 'rgba(225, 26, 104, 0.3)';
                break;
        }

        const dataset = {
            label: task.name,
            data: [
                {
                    x: [startDate, endDate],
                    y: task.name,
                    EventName: task.name,
                },
            ],
            backgroundColor: backgroundColor + '90',
            borderColor,
            hoverBackgroundColor: backgroundColor,
            borderWidth: 1,
            borderSkipped: false,
            borderRadius: 5,
            barThickness: 20,
        };

        formattedData.datasets.push(dataset);
    });

    return formattedData;
};

export default formatGanttData;