export const getCostChartOptions = (t: Function, annotations: any) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: t('EVM Cost Metrics') },
        annotation: { annotations },
        tooltip: { mode: 'index', intersect: false },
        datalabels: { display: false }
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
        y: { title: { display: true, text: t('Cost Value') }, min: 0, grace: '5%' }
    }
});
