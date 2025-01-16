import './ProjectSidebar.css'


const ProjectSidebar = () => {
    return (
        <aside className='sidebar' id='sidebar'>
            <div>
                <ul className='sidebar-list'>
                    <li>
                        <a href='/summary'>Summary</a>
                    </li>
                    <li>
                        <a href='/task_list'>Task List</a>
                    </li>
                    <li>
                        <a href='/kanban'>Kanban</a>
                    </li>
                    <li>
                        <a href='/gantt_chart'>Gantt Chart</a>
                    </li>
                    <li>
                        <a href='/calendar'>Calendar</a>
                    </li>
                    <li>
                        <a href='/cpm'>CPM</a>
                    </li>
                    <li>
                        <a href='/evm'>EVM</a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default ProjectSidebar