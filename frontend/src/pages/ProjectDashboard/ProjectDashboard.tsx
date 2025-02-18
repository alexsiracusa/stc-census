import './ProjectDashboard.css'

import ProjectRow from "../../components/ProjectRow/ProjectRow.tsx";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import useFetchDashboard from "../../hooks/useFetchDashboard.ts";
import AddProjectButton from "../../components/AddProjectButton/AddProjectButton.tsx";
import ProjectRowHeader from "../../components/ProjectRow/ProjectRowHeader.tsx";
import {useState} from "react";
import {sortArray, SortOptions} from "../../utils/sort.ts";
import {Project} from "../../types/Project.ts";
import XMark from "../../assets/Icons/X.svg";
import Edit from "../../assets/Icons/Edit2.svg";
import ConfirmPopup from "../../components/ConfirmPopup/ConfirmPopup.tsx";
import Trash from "../../assets/Icons/Trash2.svg";
import useDeleteProjects from "../../hooks/useDeleteProjects.ts";
import ProjectEditingHeader from "../../components/EditingHeader/ProjectEditingHeader/ProjectEditingHeader.tsx";


const ProjectDashboard = () => {
    const {loading, error} = useFetchDashboard()
    const [editingProjects, setEditingProjects] = useState(false)
    const projects = useSelector((state) => state.projects.byId);
    const project_ids = useSelector((state) => state.projects.dashboard);
    const [projectSortOptions, setProjectSortOptions] = useState({key: 'target_completion_date', order: 'asc'} as SortOptions<Project>)
    const selectedProjects = new Set<number>();
    const {deleteProjects, loadingDeleteProjects, errorDeleteProjects, dataDeleteProjects} = useDeleteProjects();

    const {t} = useTranslation();

    if (error) return <p>Project Dashboard Error: {error.toString()}</p>;
    if (loading || project_ids === undefined) return <p>{t('projectView.loading')}</p>;

    const sortedProjects = sortArray(project_ids.map((id) => projects[id]), projectSortOptions) as Project[]

    return (
        <div className='project-dashboard'>
            <ProjectEditingHeader
                editing={editingProjects}
                setEditing={setEditingProjects}
                selected={selectedProjects}
            />

            <ul className='project-list'>
                <AddProjectButton project_id={undefined}/>

                <ProjectRowHeader
                    projectSortOptions={projectSortOptions}
                    setProjectSortOptions={setProjectSortOptions}
                />

                {sortedProjects.map((project) => (
                    <li key={project.id}>
                        <ProjectRow
                            project_id={project.id}
                            editing={editingProjects}
                            select={(value) => {
                                if (value) selectedProjects.add(project.id)
                                else selectedProjects.delete(project.id)
                            }}
                        />
                    </li>
                ))}
            </ul>

        </div>
    )
};

export default ProjectDashboard;