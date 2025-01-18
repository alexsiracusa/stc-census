import './ProjectView.css'
import {Route, Routes, Navigate} from "react-router-dom";

import Summary from "./ProjectTabs/Summary.tsx";
import TaskList from "./ProjectTabs/TaskList.tsx";
import Kanban from "./ProjectTabs/Kanban.tsx";
import GanttChart from "./ProjectTabs/GanttChart.tsx";
import Calendar from "./ProjectTabs/Calendar.tsx";
import CPM from "./ProjectTabs/CPM.tsx";
import EVM from "./ProjectTabs/EVM.tsx";

type ProjectViewProps = {
    id: number
}

const ProjectView = (props: ProjectViewProps) => {
    return (
        <Routes>
            <Route path="/summary" element={<Summary/>}/>
            <Route path="/task-list" element={<TaskList/>}/>
            <Route path="/kanban" element={<Kanban/>}/>
            <Route path="/gantt-chart" element={<GanttChart/>}/>
            <Route path="/calendar" element={<Calendar/>}/>
            <Route path="/cpm" element={<CPM/>}/>
            <Route path="/evm" element={<EVM/>}/>
            <Route path="/*" element={<Navigate to={`/project/${props.id}/summary`} replace />}/>
        </Routes>
    )
};

export default ProjectView;