import TabProps from "./TabProps.ts";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import ProjectRow from "../../ProjectRow/ProjectRow.tsx";

const TaskList = (props: TabProps) => {
    const [project, setProject] = useState(null);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        fetch(`${host}/project/${props.project_id}`)
            .then(response => response.json())
            .then(json => {
                setProject(json)
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div className='task-list'>
            {project !== null && (
                <>
                    {project['sub_projects'].length > 0 &&
                        <ul>
                            <h2>Sub Projects</h2>
                            {project['sub_projects'].map((project) => (
                                <li key={project.id}>
                                    <ProjectRow project={project}/>
                                </li>
                            ))}
                        </ul>
                    }

                    {project['tasks'].length > 0 &&
                        <ul>
                            <h2>Tasks</h2>
                            {project['tasks'].map((task) => (
                                <li key={task.id}>
                                    <Link
                                        to='/'
                                        className={'project-row'}
                                    >
                                        {task['name']}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    }
                </>
            )}
        </div>
    )
};

export default TaskList;