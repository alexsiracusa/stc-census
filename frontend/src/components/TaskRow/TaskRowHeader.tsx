import './TaskRow.css'

const TaskRowHeader = () => {

    return (
        <div className='task-row-header'>
            <div className='task-id-header'><p>ID</p></div>
            <div className='task-name-header'><p>Name</p></div>
            <div className='task-status-header'><p>Status</p></div>
            <div className='task-depends-list-header'><p>Depends On</p></div>
            <div className='task-start-date-header'><p>Start Date</p></div>
            <div className='task-end-date-header'><p>End Date</p></div>
        </div>
    )
};

export default TaskRowHeader;