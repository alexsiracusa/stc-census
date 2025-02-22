import React, { useState } from "react";
import "./EventForm.css";
import TaskStatusSelector from "../../../../../TaskComponents/TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "../../../../../TaskComponents/TaskRow/TaskDependsList/TaskDependsList.tsx";
import SimpleDatePicker from "../../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import NumberEditor from "../../../../../GenericComponents/NumberEditor/NumberEditor.tsx";
import { Task } from "../../../../../../types/Task";

type EventFormProps = {
    onSaveTask: (taskData: Task) => void;
    initialData?: Task;
    onClose: () => void;
};

const EventForm: React.FC<EventFormProps> = ({ onSaveTask, initialData, onClose }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [status, setStatus] = useState(initialData?.status || "Todo");
    const [dependsOn, setDependsOn] = useState(initialData?.depends_on || []);
    const [targetStartDate, setTargetStartDate] = useState(initialData?.target_start_date || null);
    const [targetCompletionDate, setTargetCompletionDate] = useState(
        initialData?.target_completion_date || null
    );
    const [targetDaysToComplete, setTargetDaysToComplete] = useState(
        initialData?.target_days_to_complete || 0
    );
    const [actualStartDate, setActualStartDate] = useState(initialData?.actual_start_date || null);
    const [actualCompletionDate, setActualCompletionDate] = useState(
        initialData?.actual_completion_date || null
    );
    const [expectedCost, setExpectedCost] = useState(initialData?.expected_cost || 0);
    const [actualCost, setActualCost] = useState(initialData?.actual_cost || 0);

    const handleSave = () => {
        if (!name.trim()) {
            alert("Task name cannot be empty.");
            return;
        }

        if (
            targetStartDate &&
            targetCompletionDate &&
            new Date(targetCompletionDate) < new Date(targetStartDate)
        ) {
            alert("Target completion date cannot be earlier than the target start date.");
            return;
        }

        const taskData: Task = {
            id: initialData?.id || Date.now(), // Use timestamp or generate unique ID for a new task
            project_id: initialData?.project_id || 0, // Project ID must be provided externally or default to 0
            name: name.trim(),
            description: description.trim() || null,
            status: status as Task["status"],
            created_at: initialData?.created_at || new Date().toISOString(),
            actual_start_date: actualStartDate,
            actual_completion_date: actualCompletionDate,
            target_start_date: targetStartDate,
            target_completion_date: targetCompletionDate,
            target_days_to_complete: targetDaysToComplete || null,
            actual_cost: actualCost || null,
            expected_cost: expectedCost || null,
            depends_on: dependsOn,
        };

        onSaveTask(taskData);
        onClose();
    };

    return (
        <div className="event-form">
            <button className="close-button" onClick={onClose}>
                ×
            </button>
            <div className="event-form-body">
                <input
                    type="text"
                    className="event-title-input"
                    placeholder="Enter Task Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="event-description-input"
                    placeholder="Enter Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="event-status-select">
                    <TaskStatusSelector
                        currentStatus={status}
                        onChange={(newStatus) => setStatus(newStatus)}
                    />
                </div>

                <div className="task-dependencies">
                    <TaskDependsList
                        dependsOn={dependsOn}
                        onChange={(updatedDepends) => setDependsOn(updatedDepends)}
                    />
                </div>

                <div className="event-date-inputs">
                    <div className="task-start-date">
                        <SimpleDatePicker
                            currentDate={targetStartDate}
                            title="Target Start Date"
                            onChange={(value) => setTargetStartDate(value)}
                        />
                    </div>
                    <span className="date-separator">-</span>
                    <div className="task-due-date">
                        <SimpleDatePicker
                            currentDate={targetCompletionDate}
                            title="Target Completion Date"
                            onChange={(value) => setTargetCompletionDate(value)}
                        />
                    </div>
                </div>

                <div className="task-budget-fields">
                    <div className="task-expected-cost">
                        <NumberEditor
                            value={expectedCost || 0}
                            negative={false}
                            step={10}
                            setValue={(value) => setExpectedCost(value)}
                            title="Edit Expected Cost"
                        />
                    </div>

                    <div className="task-actual-cost">
                        <NumberEditor
                            value={actualCost || 0}
                            negative={false}
                            step={10}
                            setValue={(value) => setActualCost(value)}
                            title="Edit Actual Cost"
                        />
                    </div>
                </div>

                <div className="task-days-to-complete">
                    <NumberEditor
                        value={targetDaysToComplete || 0}
                        negative={false}
                        step={1}
                        setValue={(value) => setTargetDaysToComplete(value)}
                        title="Edit Days to Complete"
                    />
                </div>

                <div className="task-actual-start-date">
                    <SimpleDatePicker
                        currentDate={actualStartDate}
                        title="Edit Actual Start Date"
                        onChange={(value) => setActualStartDate(value)}
                    />
                </div>

                <div className="task-actual-end-date">
                    <SimpleDatePicker
                        currentDate={actualCompletionDate}
                        title="Edit Actual Completion Date"
                        onChange={(value) => setActualCompletionDate(value)}
                    />
                </div>

                <button className="save-button" onClick={handleSave}>
                    Save Task
                </button>
            </div>
        </div>
    );
};

export default EventForm;
