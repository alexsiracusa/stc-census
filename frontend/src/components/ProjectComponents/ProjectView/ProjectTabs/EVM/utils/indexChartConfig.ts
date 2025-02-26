export const getIndexChartOptions = (t: Function) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: t('EVM Index Metrics') },
        tooltip: { mode: 'index', intersect: false },
        datalabels: { display: false },
        annotation: {
            // annotation configuration remains the same
        }
    },
    scales: {
        x: {
            title: { display: true, text: t('Date') },
            type: 'time',
            time: {
                unit: 'day',
                displayFormats: {
                    day: 'dd-MM-yyyy'
                }
            }
        },
        left: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: t('EVM Metrics (%)') },
            ticks: {
                callback: (value: number) => `${value}%`
            },
            beginAtZero: true,
        }
    }
});
