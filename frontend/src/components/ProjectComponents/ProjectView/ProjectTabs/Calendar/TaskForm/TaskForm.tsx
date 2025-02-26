import React, { useState } from "react";
import "./TaskForm.css";
import TaskStatusSelector from "../../../../../TaskComponents/TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "../../../../../TaskComponents/TaskRow/TaskDependsList/TaskDependsList.tsx";
import SimpleDatePicker from "../../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import NumberEditor from "../../../../../GenericComponents/NumberEditor/NumberEditor.tsx";
import TaskPersonInChargePicker from "../../../../../TaskComponents/TaskAssignPicker/TaskPersonInChargePicker.tsx";
import { useSelector } from "react-redux";
import useUpdateTask from "../../../../../../hooks/useUpdateTask.ts";
import { useTranslation } from "react-i18next";
import Close from "../../../../../../assets/Icons/Close.svg"

export type TaskFormProps = {
    project_id: number;
    task_id: number;
    onClose: () => void;
    onSave: (task: { name: string }) => void;
};

const TaskForm = (props: TaskFormProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const { t } = useTranslation();
    const [name, setName] = useState("");

    const { updateTask } = useUpdateTask();

    if (task === undefined) {
        return <></>;
    }

    const handleSave = () => {
        if (name !== "") {
            props.onSave({ name });
            setName("");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSave();
        }
    };

    const isOverdue = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return task.status !== 'done' && task.target_completion_date && (new Date(task.target_completion_date) < now);
    };

    return (
        <div className={`task-form-overlay ${isOverdue() ? "overdue" : ""}`}>
            <div className="task-form-header">
                <h2>{t("Create Task")}</h2>
                <button className="close-button" onClick={props.onClose}>
                    <img src={Close} alt="Close" />
                </button>
            </div>

            <div className="task-detail">
                <div className="task-information">
                    <div className="task-name-container">
                        <input
                            className="task-title-input"
                            type="text"
                            value={name}
                            placeholder={t("Task Name")}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="task-status-container">
                        <p>Status</p>
                        <TaskStatusSelector project_id={props.project_id} task_id={props.task_id} />
                    </div>

                    <div className="task-depends-list-container">
                        <p>Depends</p>
                        <TaskDependsList project_id={props.project_id} task_id={props.task_id} />
                    </div>

                    <div className="task-start-input">
                        <p>Start</p>
                        <SimpleDatePicker
                            currentDate={task.target_start_date}
                            title={t("Start Date")}
                            onChange={(value) => {
                                updateTask(props.project_id, props.task_id, { target_start_date: value })
                            }}
                        />
                    </div>
                    <div className="task-end-input">
                        <p>End</p>
                        <SimpleDatePicker
                            currentDate={task.target_completion_date}
                            title={t("Due Date")}
                            onChange={(value) => {
                                updateTask(props.project_id, props.task_id, { target_completion_date: value })
                            }}
                        />
                    </div>

                    <div className="task-person-in-charge-container">
                        <p>Person</p>
                        <TaskPersonInChargePicker project_id={props.project_id} task_id={props.task_id} />
                    </div>

                    <div className="task-budget-container">
                        <p>Budget</p>
                        <NumberEditor
                            value={task.expected_cost}
                            step={10}
                            title={t("Budget")}
                            setValue={(value) => updateTask(props.project_id, props.task_id, { expected_cost: value })}
                        />
                    </div>
                    <div className="task-actual-container">
                        <p>Actual</p>
                        <NumberEditor
                            value={task.actual_cost}
                            step={10}
                            title={t("Actual Cost")}
                            setValue={(value) => updateTask(props.project_id, props.task_id, { actual_cost: value })}
                        />
                    </div>

                    <div className="task-days-to-complete">
                        <p>Days</p>
                        <NumberEditor
                            value={task.target_days_to_complete}
                            step={1}
                            title={t("Days to Complete")}
                            setValue={(value) => updateTask(props.project_id, props.task_id, { target_days_to_complete: value })}
                        />
                    </div>
                </div>
            </div>

            <div className="task-form-footer">
                <button className="task-save-button" onClick={handleSave}>
                    {t("Save")}
                </button>
            </div>
        </div>
    );
};

export default TaskForm;
