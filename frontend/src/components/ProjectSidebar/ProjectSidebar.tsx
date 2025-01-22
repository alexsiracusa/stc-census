import './ProjectSidebar.css'
import Ring from '../../assets/Icons/Ring.svg'
import KanbanIcon from '../../assets/Icons/Kanban.svg'
import TaskListIcon from '../../assets/Icons/TaskList.svg'
import GanttChartIcon from '../../assets/Icons/GanttChart.svg'
import { useTranslation } from 'react-i18next';
import CalendarIcon from '../../assets/Icons/Calendar.svg'
import CPMIcon from '../../assets/Icons/CPM.svg'

type ProjectSidebarProps = {
    project_id: number
}

const ProjectSidebar = (props: ProjectSidebarProps) => {
    const { t } = useTranslation();

    return (
        <aside className='sidebar' id='sidebar'>
            <ul className='sidebar-list'>
                <li>
                    <a href={`/project/${props.project_id}/summary`}>
                        <img src={Ring} alt={''}/>
                        {t('sidebar.summary')}
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/task-list`}>
                        <img src={TaskListIcon} alt={''}/>
                        {t('sidebar.taskList')}
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/kanban`}>
                        <img src={KanbanIcon} alt={''}/>
                        {t('sidebar.kanban')}
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/gantt-chart`}>
                        <img src={GanttChartIcon} alt={''}/>
                        {t('sidebar.ganttChart')}
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/calendar`}>
                        <img src={CalendarIcon} alt={''}/>
                        Calendar
                        <img src={Ring} alt={''}/>
                        {t('sidebar.calendar')}
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/cpm`}>
                        <img src={CPMIcon} alt={''}/>
                        CPM
                        <img src={Ring} alt={''}/>
                        {t('sidebar.CPM')}
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/evm`}>
                        <img src={Ring} alt={''}/>
                        {t('sidebar.EVM')}
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default ProjectSidebar