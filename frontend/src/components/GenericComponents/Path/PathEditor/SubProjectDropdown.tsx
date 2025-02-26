import useFetchProject from "../../../../hooks/useFetchProject.ts";
import {useSelector} from "react-redux";

type SubProjectDropdownProps = {
    project_id: number
    select: (number) => void
    setIsVisible: (boolean) => void
}

const SubProjectDropdown = (props: SubProjectDropdownProps) => {
    const {loading, error} = useFetchProject(props.project_id);
    const project = useSelector((state) => state.projects.byId[props.project_id]);

    if (!project|| !project.sub_projects) {
        return <div>Loading</div>
    }

    return (
        project.sub_projects.length === 0 ? (
            <div className='sub-project-row'>
                <p>No Subprojects</p>
            </div>
        ) : (
            project.sub_projects.map((subProject) => (
                <button
                    key={subProject.id}
                    className='sub-project-row clickable'
                    onClick={() => {
                        props.select(subProject.id)
                        props.setIsVisible(false)
                    }}
                >
                    <p>{subProject.name}</p>
                </button>
            ))

        )
    )
}

export default SubProjectDropdown