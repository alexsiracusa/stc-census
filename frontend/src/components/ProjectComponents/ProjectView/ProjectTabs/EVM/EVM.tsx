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

// Register necessary ChartJS modules and the annotation plugin.
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

// Custom hook to fetch EVM data.
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

    // If there is no evm data to display.
    if (!evmData.evm) {
        return <div className="evm">No EVM data available.</div>
    }

    // Extract arrays from the evm data.
    const plannedValue = evmData.evm.planned_value || []
    const earnedValue = evmData.evm.earned_value || []

    // Map the data—each element is assumed to be a [date, cost] pair.
    const dates = plannedValue.map((pair: [string, number]) => pair[0])
    const plannedCosts = plannedValue.map((pair: [string, number]) => pair[1])
    const earnedCosts = earnedValue.map((pair: [string, number]) => pair[1])

    // Define the given target date.
    const givenDate = evmData.evm.metadata.today // Change this value as needed.
    // Clip the given date to the chart range.
    let verticalLineDate = givenDate
    if (dates.length) {
        if (givenDate < dates[0]) {
            verticalLineDate = dates[0]
        } else if (givenDate > dates[dates.length - 1]) {
            verticalLineDate = dates[dates.length - 1]
        }
    }

    // Chart data config.
    const data = {
        labels: dates,
        datasets: [
            {
                label: t('Planned Value'),
                data: plannedCosts,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: false,
                tension: 0.0,
            },
            {
                label: t('Earned Value'),
                data: earnedCosts,
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
                fill: false,
                tension: 0.0,
            }
        ]
    }

    // Chart options including the vertical dashed annotation.
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: t('EVM Graph')
            },
            datalabels: {
                display: false
            },
            annotation: {
                annotations: {
                    verticalLine: {
                        type: 'line',
                        scaleID: 'x',
                        value: verticalLineDate,
                        borderColor: 'grey',
                        borderWidth: 2,
                        borderDash: [10, 5],
                        // Optionally add a label to the line.
                        label: {
                            enabled: true,
                            content: t('Target Date'),
                            position: 'start'
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t('Date')
                }
            },
            y: {
                title: {
                    display: true,
                    text: t('Cost Value')
                },
                min: 0,
                // max: 100000
            }
        }
    }

    // Grab metrics from the evm data.
    const metrics = evmData.evm.metrics || {}

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
                            <td>{value === null ? 'N/A' : value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EVM
