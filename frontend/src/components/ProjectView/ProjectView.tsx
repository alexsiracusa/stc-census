import './ProjectView.css'

type ProjectViewProps = {
    id: number
}

const ProjectView = (props: ProjectViewProps) => {
    return (
        <div className='project-view'>
            Project View {props.id}
        </div>
    )
};

export default ProjectView;