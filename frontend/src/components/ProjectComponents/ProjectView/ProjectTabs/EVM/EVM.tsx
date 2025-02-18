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
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
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

    // Ensure there is an evm object before proceeding.
    if (!evmData.evm) {
        return <div className="evm">No EVM data available.</div>
    }

    // Extract the data for plotting;
    // each array is assumed to be an array of [date, cost] pairs.
    const plannedValue = evmData.evm.planned_value || []
    const earnedValue = evmData.evm.earned_value || []

    // Create labels based on the dates. In this example, we assume the dates in plannedValue and earnedValue are aligned.
    const labels = plannedValue.map((item: [string, number]) => item[0])
    const plannedCosts = plannedValue.map((item: [string, number]) => item[1])
    const earnedCosts = earnedValue.map((item: [string, number]) => item[1])

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: t('EVM.planned_value', "Planned Value"),
                data: plannedCosts,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                tension: 0,
                fill: false,
            },
            {
                label: t('EVM.earned_value', "Earned Value"),
                data: earnedCosts,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 128, 0, 0.5)',
                tension: 0,
                fill: false,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: t('EVM.graph_title', "Graph of Planned Value and Earned Value"),
            },
        },
        scales: {
            x: {
                type: 'category' as const,
                title: {
                    display: true,
                    text: t('EVM.x_axis', "Date"),
                },
            },
            y: {
                title: {
                    display: true,
                    text: t('EVM.y_axis', "Cost"),
                },
            },
        },
    }

    return (
        <div className="evm">
            <h2>{t('EVM.title')}</h2>
            <table>
                <thead>
                <tr>
                    <th>{t('EVM.metric', "Metric")}</th>
                    <th>{t('EVM.value', "Value")}</th>
                </tr>
                </thead>
                <tbody>
                {evmData.evm.metrics && Object.entries(evmData.evm.metrics).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{value !== null ? value : '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{t('EVM.graph_title', "Graph of Planned Value and Earned Value")}</h3>
            <div id="evm-chart">
                <Line data={chartData} options={options} />
            </div>
        </div>
    )
}

export default EVM
