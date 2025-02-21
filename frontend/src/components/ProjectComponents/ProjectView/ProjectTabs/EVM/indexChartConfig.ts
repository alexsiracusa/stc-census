export const getIndexChartOptions = (t: Function) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
        title: { display: true, text: t('EVM Index Metrics') }
    },
    scales: {
        left: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: t('Variance (%)') }
        },
        right: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: t('Cost Performance Index') },
            grid: { drawOnChartArea: false }
        }
    }
});
