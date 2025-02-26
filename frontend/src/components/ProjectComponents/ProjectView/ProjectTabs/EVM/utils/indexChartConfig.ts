export const getIndexChartOptions = (t: Function) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: t('EVM Index Metrics') },
        tooltip: { mode: 'index', intersect: false },
        datalabels: { display: false },
        annotation: {
            annotations: {
                horizontalLine0: {
                    type: 'line',
                    yMin: 0,
                    yMax: 0,
                    borderColor: 'grey',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    label: {
                        enabled: true,
                        content: '0%',
                        position: 'end'
                    }
                },
                horizontalLine100: {
                    type: 'line',
                    yMin: 100,
                    yMax: 100,
                    borderColor: 'grey',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    label: {
                        enabled: true,
                        content: '100%',
                        position: 'end'
                    }
                },
                horizontalLineNeg100: {
                    type: 'line',
                    yMin: -100,
                    yMax: -100,
                    borderColor: 'grey',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    label: {
                        enabled: true,
                        content: '100%',
                        position: 'end'
                    }
                }
            }
        }
    },
    scales: {
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
