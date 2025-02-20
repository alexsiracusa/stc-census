import './EVM.css'
import { useTranslation } from 'react-i18next'
import TabProps from "../TabProps"
import { useEffect, useState } from "react"
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
)

const useFetchEvmData = (projectId: number): [any, boolean] => {
    const [evmData, setEvmData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const host = import.meta.env.VITE_BACKEND_HOST

    useEffect(() => {
        setLoading(true)
        fetch(`${host}/project/${projectId}/evm`)
            .then(response => response.json())
            .then(json => {
                setEvmData(json)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            })
    }, [projectId, host])

    return [evmData, loading]
}

const EVM = (props: TabProps) => {
    const { t } = useTranslation()
    const projectId = Number(props.project_id)
    const [evmData, evmLoading] = useFetchEvmData(projectId)

    if (evmLoading) {
        return <div className="evm">Loading EVM data...</div>
    }

    if (!evmData.evm) {
        return <div className="evm">No EVM data available.</div>
    }

    const plannedValue = evmData.evm.planned_value || []
    const earnedValue = evmData.evm.earned_value || []
    const actualCost = evmData.evm.actual_cost || []

    // Get actual date from metrics
    const actualDate = evmData.evm.metrics.date_of_latest_done_task || ''
    const dates = plannedValue.map((pair: [string, number]) => pair[0])

    // Clip earned value data after actual date
    const earnedCosts = earnedValue.map((pair: [string, number]) => {
        const date = pair[0]
        return date <= actualDate ? pair[1] : null
    })

    const actualCosts = actualCost.map((pair: [string, number]) => {
        const date = pair[0]
        return date <= actualDate ? pair[1] : null
    })

    const plannedCosts = plannedValue.map((pair: [string, number]) => pair[1])

    // Determine vertical line position (clipped to chart range)
    let verticalLineDate = actualDate
    if (dates.length) {
        if (actualDate < dates[0]) {
            verticalLineDate = dates[0]
        } else if (actualDate > dates[dates.length - 1]) {
            verticalLineDate = dates[dates.length - 1]
        }
    }

    // Find index for actual date in dataset
    const actualIndex = dates.indexOf(verticalLineDate)
    const metrics = evmData.evm.metrics || {}

    // Prepare variance annotations
    const annotations: any = {
        verticalLine: {
            type: 'line',
            scaleID: 'x',
            value: verticalLineDate,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [10, 5],
            label: {
                enabled: true,
                content: t('Actual Time'),
                position: 'start'
            }
        }
    }

    if (actualIndex !== -1) {
        const pv = plannedCosts[actualIndex]
        const ev = earnedCosts[actualIndex]
        const ac = actualCosts[actualIndex]

        // Schedule Variance annotation (EV vs PV)
        if (typeof pv === 'number' && typeof ev === 'number') {
            annotations.scheduleVariance = {
                type: 'line',
                xMin: verticalLineDate,
                xMax: verticalLineDate,
                yMin: pv,
                yMax: ev,
                borderColor: '#FF6B6B',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                    enabled: true,
                    content: `SV: ${metrics.schedule_variance}`,
                    position: 'right',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }
            }
        }

        // Cost Variance annotation (EV vs AC)
        if (typeof ev === 'number' && typeof ac === 'number') {
            annotations.costVariance = {
                type: 'line',
                xMin: verticalLineDate,
                xMax: verticalLineDate,
                yMin: ev,
                yMax: ac,
                borderColor: '#4D96FF',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                    enabled: true,
                    content: `CV: ${metrics.cost_variance}`,
                    position: 'left',
                    backgroundColor: 'rgba(255,255,255,0.8)'
                }
            }
        }
    }

    const data = {
        labels: dates,
        datasets: [
            {
                label: t('Planned Value'),
                data: plannedCosts,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.0,
                datalabels: {
                    display: false
                }
            },
            {
                label: t('Earned Value'),
                data: earnedCosts,
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.0,
                datalabels: {
                    display: false
                }
            },
            {
                label: t('Actual Cost'),
                data: actualCosts,
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.0,
                datalabels: {
                    display: false
                }
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: t('EVM Graph') },
            annotation: { annotations },
            tooltip: {
                enabled: true,
                displayColors: true,
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: { title: { display: true, text: t('Date') } },
            y: {
                title: { display: true, text: t('Cost Value') },
                min: 0,
                grace: '5%', // padding for annotations
            }
        }
    }

    return (
        <div className="evm">
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>

            <div className="table-container">
                <table className="evm-metrics-table">
                    <thead>
                    <tr>
                        <th>{t('Metric')}</th>
                        <th>{t('Value')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(metrics).map(([key, value]) => (
                        <tr key={key}>
                            <td>{t(key)}</td>
                            <td>{value ?? 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EVM
