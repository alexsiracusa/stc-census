import { useState } from 'react';
import './AddTask.css'

const AddTask = () => {
    const [addPopup, setAddPopup] = useState(false);
    const [task, setTask] = useState({
        name: '',
        description: '',
        status: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [id]: value,
        }));
    };

    const handleAdd = (e) => {
        setAddPopup(false);
        e.preventDefault();
        // API call to add task
        setTask({name: '', description: '', status: ''})
    }

    return (
        <>
            <button
                className='button'
                type='button'
                onClick={() => setAddPopup(true)}
            >
                + Add New Task
            </button>

            {addPopup ? (
                <>
                    <div className='popup'>
                        <div className='container'>
                            <div className='popup-header'>
                                <h3>Add New Task</h3>
                                <button className='close-button' onClick={() => setAddPopup(false)}>X</button>
                            </div>

                            <form className='form' onSubmit={handleAdd}>
                                <div>
                                    <label className='label' htmlFor='name'>
                                        Task name
                                    </label>
                                    <input
                                        className='input-field'
                                        id='name'
                                        type='text'
                                        placeholder='Task name'
                                        value={task.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='label' htmlFor='description'>
                                        Description
                                    </label>
                                    <textarea
                                        className='input-field'
                                        id='description'
                                        rows={3}
                                        placeholder='Description'
                                        value={task.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className='label' htmlFor='name'>
                                        Task status
                                    </label>
                                    <input
                                        className='input-field'
                                        id='status'
                                        type='text'
                                        placeholder='Task status'
                                        value={task.status}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='popup-footer'>
                                    <button
                                        className='button'
                                        type='submit'
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            ) : null}
        </>


    )
}

export default AddTask;