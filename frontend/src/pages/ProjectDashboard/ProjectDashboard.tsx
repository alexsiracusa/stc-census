import './ProjectDashboard.css'

import ProjectRow from "../../components/ProjectComponents/ProjectRow/ProjectRow.tsx";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import useFetchDashboard from "../../hooks/useFetchDashboard.ts";
import AddProjectButton from "../../components/ProjectComponents/AddProjectButton/AddProjectButton.tsx";
import ProjectRowHeader from "../../components/ProjectComponents/ProjectRow/ProjectRowHeader.tsx";
import {useState} from "react";
import {sortArray, SortOptions} from "../../utils/sort.ts";
import {Project} from "../../types/Project.ts";
import ProjectEditingHeader
    from "../../components/GenericComponents/EditingHeader/ProjectEditingHeader/ProjectEditingHeader.tsx";


const ProjectDashboard = () => {
    const {loading, error} = useFetchDashboard()
    const [editingProjects, setEditingProjects] = useState(false)
    const projects = useSelector((state) => state.projects.byId);
    const project_ids = useSelector((state) => state.projects.dashboard);
    const [projectSortOptions, setProjectSortOptions] = useState({
        key: 'target_completion_date',
        order: 'asc'
    } as SortOptions<Project>)
    const selectedProjects = new Set<number>();
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
                dashboard={true}
            />

            <div className='project-list'>
                <AddProjectButton project_id={undefined}/>

                <div className='list-container'>
                    <ProjectRowHeader
                        projectSortOptions={projectSortOptions}
                        setProjectSortOptions={setProjectSortOptions}
                    />

                    <ul>
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
            </div>

        </div>
    )
};

export default ProjectDashboard;