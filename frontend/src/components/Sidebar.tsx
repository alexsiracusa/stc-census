import './Sidebar.css'
import {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
    const [activeLink, setActiveLink] = useState<string>('');

    const handleLinkClick = (link: string) => {
        setActiveLink(link);
    };

    return (
        <aside id='sidebar'>
            <div>
                <ul className='sidebar-list'>
                    <li>
                        <a
                            href='/summary'
                            onClick={() => handleLinkClick('summary')}
                            className={activeLink === 'summary' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'summary' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            Summary
                        </a>
                    </li>
                    <li>
                        <a
                            href='/task_list'
                            onClick={() => handleLinkClick('task_list')}
                            className={activeLink === 'task_list' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'task_list' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            Task List
                        </a>
                    </li>
                    <li>
                        <a
                            href='/kanban'
                            onClick={() => handleLinkClick('kanban')}
                            className={activeLink === 'kanban' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'kanban' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            Kanban
                        </a>
                    </li>
                    <li>
                        <a
                            href='/gantt_chart'
                            onClick={() => handleLinkClick('gantt_chart')}
                            className={activeLink === 'gantt_chart' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'gantt_chart' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            Gantt Chart
                        </a>
                    </li>
                    <li>
                        <a
                            href='/calendar'
                            onClick={() => handleLinkClick('calendar')}
                            className={activeLink === 'calendar' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'calendar' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            Calendar
                        </a>
                    </li>
                    <li>
                        <a
                            href='/cpm'
                            onClick={() => handleLinkClick('cpm')}
                            className={activeLink === 'cpm' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'cpm' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            CPM
                        </a>
                    </li>
                    <li>
                        <a
                            href='/evm'
                            onClick={() => handleLinkClick('evm')}
                            className={activeLink === 'evm' ? 'active' : ''}
                        >
                            <FontAwesomeIcon
                                icon={activeLink === 'evm' ? faCircle : faCircleNotch}
                                style={{ marginRight: '10px' }}
                            />
                            EVM
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar