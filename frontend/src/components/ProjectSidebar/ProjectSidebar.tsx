import './ProjectSidebar.css'
import Ring from '../../assets/Icons/Ring.svg'
import KanbanIcon from '../../assets/Icons/Kanban.svg'
import TaskListIcon from '../../assets/Icons/TaskList.svg'
import GanttChartIcon from '../../assets/Icons/GanttChart.svg'
import CalendarIcon from '../../assets/Icons/Calendar.svg'
import CPMIcon from '../../assets/Icons/CPM.svg'

type ProjectSidebarProps = {
    project_id: number
}

const ProjectSidebar = (props: ProjectSidebarProps) => {
    return (
        <aside className='sidebar' id='sidebar'>
            <ul className='sidebar-list'>
                <li>
                    <a href={`/project/${props.project_id}/summary`}>
                        <img src={Ring} alt={''}/>
                        Summary
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/task-list`}>
                        <img src={TaskListIcon} alt={''}/>
                        Task List
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/kanban`}>
                        <img src={KanbanIcon} alt={''}/>
                        Kanban
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/gantt-chart`}>
                        <img src={GanttChartIcon} alt={''}/>
                        Gantt Chart
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/calendar`}>
                        <img src={CalendarIcon} alt={''}/>
                        Calendar
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/cpm`}>
                        <img src={CPMIcon} alt={''}/>
                        CPM
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.project_id}/evm`}>
                        <img src={Ring} alt={''}/>
                        EVM
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default ProjectSidebar