import './ProjectView.css'
import {Route, Routes, Navigate} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Summary from "./ProjectTabs/Summary/Summary.tsx";
import TaskList from "./ProjectTabs/TaskList/TaskList.tsx";
import Kanban from "./ProjectTabs/Kanban/Kanban.tsx";
import GanttChart from "./ProjectTabs/GanttChart/GanttChart.tsx";
import Calendar from "./ProjectTabs/Calendar/Calendar.tsx";
import CPM from "./ProjectTabs/CPM/CPM.tsx";
import EVM from "./ProjectTabs/EVM/EVM.tsx";

import ProjectPath from "../ProjectPath/ProjectPath.tsx";
import {useEffect, useState} from "react";

type ProjectViewProps = {
    project_id: number
}

const ProjectView = (props: ProjectViewProps) => {
    const [project, setProject] = useState(null);
    const host = import.meta.env.VITE_BACKEND_HOST;
    const { t } = useTranslation();

    useEffect(() =>  {
        (async () => {
            try {
                const response = await fetch(`${host}/project/${props.project_id}`);
                const json = await response.json()
                if (!response.ok) return console.error(json['error']);
                setProject(json)
            }
            catch (error) {
                console.error(error)
            }
        })();
    }, []);

    if (project === null) {
        return <div>{t('projectView.loading')}</div>
    }

    return (
        <div className='project-view'>
            <ProjectPath path={project['path']}/>
            <Routes>
                <Route path="/summary" element={<Summary project={project}/>}/>
                <Route path="/task-list" element={<TaskList project={project}/>}/>
                <Route path="/kanban" element={<Kanban project={project}/>}/>
                <Route path="/gantt-chart" element={<GanttChart project={project}/>}/>
                <Route path="/calendar" element={<Calendar project={project}/>}/>
                <Route path="/cpm" element={<CPM project={project}/>}/>
                <Route path="/evm" element={<EVM project={project}/>}/>
                <Route path="/*" element={<Navigate to={`/project/${props.project_id}/summary`} replace/>}/>
            </Routes>
        </div>
    )
};

export default ProjectView;