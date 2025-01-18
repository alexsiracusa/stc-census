import './ProjectSidebar.css'
import Ring from '../../assets/Icons/Ring.svg'

type ProjectSidebarProps = {
    id: number
}

const ProjectSidebar = (props: ProjectSidebarProps) => {
    return (
        <aside className='sidebar' id='sidebar'>
            <ul className='sidebar-list'>
                <li>
                    <a href={`/project/${props.id}/summary`}>
                        <img src={Ring} alt={''}/>
                        Summary
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.id}/task-list`}>
                        <img src={Ring} alt={''}/>
                        Task List
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.id}/kanban`}>
                        <img src={Ring} alt={''}/>
                        Kanban
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.id}/gantt-chart`}>
                        <img src={Ring} alt={''}/>
                        Gantt Chart
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.id}/calendar`}>
                        <img src={Ring} alt={''}/>
                        Calendar
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.id}/cpm`}>
                        <img src={Ring} alt={''}/>
                        CPM
                    </a>
                </li>
                <li>
                    <a href={`/project/${props.id}/evm`}>
                        <img src={Ring} alt={''}/>
                        EVM
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default ProjectSidebar