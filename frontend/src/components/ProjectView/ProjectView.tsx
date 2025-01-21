import './ProjectView.css'
import {Route, Routes, Navigate} from "react-router-dom";

import Summary from "./ProjectTabs/Summary.tsx";
import TaskList from "./ProjectTabs/TaskList/TaskList.tsx";
import Kanban from "./ProjectTabs/Kanban.tsx";
import GanttChart from "./ProjectTabs/GanttChart.tsx";
import Calendar from "./ProjectTabs/Calendar.tsx";
import CPM from "./ProjectTabs/CPM.tsx";
import EVM from "./ProjectTabs/EVM.tsx";

type ProjectViewProps = {
    project_id: number
}

const ProjectView = (props: ProjectViewProps) => {
    return (
        <div className='project-view'>
            <Routes>
                <Route path="/summary" element={<Summary project_id={props.project_id}/>}/>
                <Route path="/task-list" element={<TaskList project_id={props.project_id}/>}/>
                <Route path="/kanban" element={<Kanban project_id={props.project_id}/>}/>
                <Route path="/gantt-chart" element={<GanttChart project_id={props.project_id}/>}/>
                <Route path="/calendar" element={<Calendar project_id={props.project_id}/>}/>
                <Route path="/cpm" element={<CPM project_id={props.project_id}/>}/>
                <Route path="/evm" element={<EVM project_id={props.project_id}/>}/>
                <Route path="/*" element={<Navigate to={`/project/${props.project_id}/summary`} replace/>}/>
            </Routes>
        </div>
    )
};

export default ProjectView;