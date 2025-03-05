import './ProjectTeamAlias.css';

import { useSelector } from "react-redux";
import useUpdateProject from "../../../../hooks/useUpdateProject.ts";
import AliasEditor from "../../../GenericComponents/AliasEditor/AliasEditor.tsx";

type ProjectTeamAliasProps = {
    project_id: number;
}

const ProjectTeamAlias = (props: ProjectTeamAliasProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const { updateProject, loading, error, data } = useUpdateProject();

    const setTeamAlias = (team_email_alias) => {
        updateProject(props.project_id, {
            team_email_alias: team_email_alias
        });
    }

    return (
        <AliasEditor team_email_alias={project.team_email_alias} setTeamAlias={setTeamAlias} />
    );
}

export default ProjectTeamAlias;
