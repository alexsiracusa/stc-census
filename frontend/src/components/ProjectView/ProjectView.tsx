import './ProjectView.css'
import {Route, Routes, Navigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Summary from "./ProjectTabs/Summary/Summary.tsx";
import TaskList from "./ProjectTabs/TaskList/TaskList.tsx";
import Kanban from "./ProjectTabs/Kanban/Kanban.tsx";
import GanttChart from "./ProjectTabs/GanttChart/GanttChart.tsx";
import Calendar from "./ProjectTabs/Calendar/Calendar.tsx";
import CPM from "./ProjectTabs/CPM/CPM.tsx";
import EVM from "./ProjectTabs/EVM/EVM.tsx";

import { useSelector } from 'react-redux';
import ProjectPath from "../ProjectPath/ProjectPath.tsx";
import useFetchProject from "../../hooks/useFetchProject.ts";

type ProjectViewProps = {
    project_id: number
}

const ProjectView = (props: ProjectViewProps) => {
    const { loading, error } = useFetchProject(props.project_id);
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const {t} = useTranslation();

    if (error) return <p>Project View Error: {error.toString()}</p>;
    if (loading || project === undefined) return <p>{t('projectView.loading')}</p>;

    return (
        <div className='project-view'>
            <ProjectPath project_id={props.project_id}/>
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