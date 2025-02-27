import React, { useState } from "react";
import "./TaskForm.css";
import { useSelector } from "react-redux";
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

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.currentTarget === event.target) {
            props.onClose();
        }
    };

    const isOverdue = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return task.status !== 'done' && task.target_completion_date && (new Date(task.target_completion_date) < now);
    };

    return (
        <div className={`task-form-overlay ${isOverdue() ? "overdue" : ""}`} onClick={handleOverlayClick}>
            <div className={'task-form-content'}>
                <div className="task-form-header">
                    <h2>{t("calendar.taskForm.createTask")}</h2>
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
                                placeholder={t("calendar.taskForm.taskName")}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>


                </div>

                <div className="task-form-footer">
                    <button className="task-save-button" onClick={handleSave}>
                        {t("calendar.taskForm.save")}
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default TaskForm;
