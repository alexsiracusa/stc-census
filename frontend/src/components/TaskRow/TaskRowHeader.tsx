import './TaskRow.css'

const TaskRowHeader = () => {

    return (
        <div className='task-row-header'>
            <div className='task-id-header'><p>ID</p></div>
            <div className='task-name-header'><p>Name</p></div>
            <div className='task-status-header'><p>Status</p></div>
        </div>
    )
};

export default TaskRowHeader;