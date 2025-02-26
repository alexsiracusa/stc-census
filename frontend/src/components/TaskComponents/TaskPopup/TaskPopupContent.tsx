import PathPicker from "../../GenericComponents/Path/PathPicker/PathPicker.tsx";
import TaskDeleteButton from "../TaskDeleteButton/TaskDeleteButton.tsx";
import TaskName from "../TaskName/TaskName.tsx";
import TaskStatusSelector from "../TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDescription from "../TaskDescription/TaskDescription.tsx";
import TaskFields from "../TaskFields/TaskFields.tsx";
import TaskDependsEditor from "../TaskDependsEditor/TaskDependsEditor.tsx";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

type TaskPopupContentProps = {
    project_id: number,
    task_id: number,
    setIsVisible: (boolean) => void
}

const TaskPopupContent = (props: TaskPopupContentProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const task = (project && project.byId && project.byId[props.task_id]) ? project.byId[props.task_id] : null
    const {t} = useTranslation();

    if (!task || !project.path) {
        return <></>
    }

    const path = [{
        name: t('projectPath.title'),
        link: '/projects'
    }].concat(project.path.map((project) => ({
        name: project.name,
        link: `/project/${project.id}/task-list`
    }))).concat([{
        name: task ? task.name : 'Task',
        link: `/project/${props.project_id}/task-list`
    }]);

    return (
        <div className='task-detail'>
            <div className='task-information'>
                <div className='top-row'>
                    <div className='task-path-container'>
                        <PathPicker path={path}/>
                    </div>

                    <div className='task-delete-button-container'>
                        <TaskDeleteButton
                            project_id={props.project_id}
                            task_id={props.task_id}
                            onDelete={() => {
                                props.setIsVisible(false)
                            }}
                        />
                    </div>
                </div>

                <div className='task-name-container'>
                    <TaskName project_id={props.project_id} task_id={props.task_id}/>
                </div>

                <div className='task-status-container'>
                    <TaskStatusSelector project_id={props.project_id} task_id={props.task_id}/>
                </div>

                <h2>Description:</h2>
                <div className='task-description-container'>
                    <TaskDescription project_id={props.project_id} task_id={props.task_id}/>
                </div>
            </div>

            <div className='task-fields-container'>
                <TaskFields project_id={props.project_id} task_id={props.task_id}/>
                <TaskDependsEditor project_id={props.project_id} task_id={props.task_id}/>
            </div>
        </div>
    )
}

export default TaskPopupContent