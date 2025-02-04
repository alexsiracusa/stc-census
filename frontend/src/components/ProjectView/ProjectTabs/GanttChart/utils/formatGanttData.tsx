import { Task } from "../../../../../types/Task";

const formatGanttData = (tasks: Task[]) => {
    const formattedData = {
        labels: [],
        datasets: [],
    };

    const taskArray = Object.values(tasks);

    taskArray.forEach((task) => {
        const startDate = task.target_start_date;
        const endDate = task.target_completion_date;
      
        formattedData.labels.push(task.name);
      
        let backgroundColor;
        let borderColor;
      
        switch (task.status) {
          case 'to_do':
            backgroundColor = 'rgba(145, 145, 145, 0.8)';
            borderColor = 'rgba(145, 145, 145, 0.3)';
            break;
          case 'in_progress':
            backgroundColor = 'rgba(0, 83, 186, 0.8)';
            borderColor = 'rgba(0, 83, 186, 0.3)';
            break;
          case 'on_hold':
            backgroundColor = 'rgba(224, 176, 0, 0.8)';
            borderColor = 'rgba(224, 176, 0, 0.3)';
            break;
          case 'done':
            backgroundColor = 'rgba(0, 138, 30, 0.8)';
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
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderSkipped: false,
          borderRadius: 5,
          barPercentage: 0.8,
        };
      
        formattedData.datasets.push(dataset);
      });

    return formattedData;
};

export default formatGanttData;