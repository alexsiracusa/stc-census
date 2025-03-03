import "./SensibleSchedulePopup.css";

import React, { useState } from "react";
import { format } from "date-fns";
import SimpleDatePicker from "../../../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import Popup from "../../../../../../GenericComponents/Popup/Popup.tsx";

import useFetchProjectSuggestedSchedule from "../../../../../../../hooks/useFetchProjectSuggestedSchedule.ts";
import useUpdateProjectSchedule from "../../../../../../../hooks/useUpdateProjectSchedule.ts";
import GanttBody from "../../../GanttChart/GanttBody/GanttBody.tsx";

interface SensibleSchedulePopupProps {
    onClose: () => void;
    project_id: number;
}

interface TaskSchedule {
    task_id: number;
    project_id: number,
    name: string,
    start_date: string;
    end_date: string;
}

const SensibleSchedulePopup: React.FC<SensibleSchedulePopupProps> = ({ onClose, project_id }) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [startDate, setStartDate] = useState<Date>(today);
    const [dueDate, setDueDate] = useState<Date>(tomorrow);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
    const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);

    // Use the useFetchProjectSuggestedSchedule hook
    const { fetchSuggestedSchedule, loading, error, data: suggestedScheduleData } = useFetchProjectSuggestedSchedule();

    // Use the useUpdateSchedule hook
    const { updateProjectSchedule, loading: updateLoading, error: updateError, data: updateResponse } = useUpdateProjectSchedule();

    const handleGenerateSchedule = () => {
        // Using date-fns format to ensure the dates are in "YYYY-MM-DD" format.
        const wanted_start = format(startDate, "yyyy-MM-dd");
        const wanted_end = format(dueDate, "yyyy-MM-dd");

        setShowConfirmation(true);
        fetchSuggestedSchedule(project_id, wanted_start, wanted_end);
    };

    const handleAcceptPlan = async () => {
        console.log("Accepting plan with schedule data:", suggestedScheduleData);

        try {
            // Call the updateProjectSchedule function from the useUpdateSchedule hook
            await updateProjectSchedule(project_id, format(startDate, "yyyy-MM-dd"), format(dueDate, "yyyy-MM-dd"));

            if (updateError) {
                setShowErrorPopup(true);
            } else {
                setShowSuccessPopup(true);
            }
        } catch (error) {
            setShowErrorPopup(true);
        } finally {
            setShowConfirmation(false);
        }
    };

    const handleRejectPlan = () => {
        setShowConfirmation(false);
    };

    // Helper function to format the suggested schedule data
    const renderSuggestedSchedule = () => {
        if (!suggestedScheduleData) return null;

        const { given_duration_in_days: givenDurationOverridden, project_start_date: projectStartDate, project_end_date: projectEndDate, project_duration_in_days: projectDurationInDays, suggested_schedule: suggestedSchedule } = suggestedScheduleData;

        const isDurationOverridden = givenDurationOverridden === 'true';

        const mappedTasks = suggestedSchedule.map((task: TaskSchedule) => ({
            id: task.task_id,
            project_id: task.project_id,
            name: task.name,
            target_start_date: task.start_date,
            target_completion_date: task.end_date,
            status: '',
        }));

        return (
            <div className="suggested-schedule-container">
                {isDurationOverridden && (
                    <div className="duration-overridden-message">
                        <p>The provided dates were unrealistic and have been overwritten.</p>
                    </div>
                )}
                <div className="project-duration">
                    <h3>Project Duration</h3>
                    <p><strong>Start Date:</strong> {projectStartDate}</p>
                    <p><strong>End Date:</strong> {projectEndDate}</p>
                    <p><strong>Duration:</strong> {projectDurationInDays} workdays</p>
                </div>
                    <div className="task-schedule">
                        <h3>Suggested Task Schedule</h3>
                        <GanttBody
                            data={mappedTasks}
                            dateRange={{
                                startDate: projectStartDate,
                                endDate: projectEndDate
                            }}
                        />
                    </div>
            </div>
        );
    };

    return (
        <>
            <Popup
                icon={<span style={{display: "none"}}/>}
                buttonClassName="hidden-button"
                contentClassName="sensible-schedule-popup-content"
                title="Select Schedule Dates"
                isVisible={true}
                setIsVisible={(visible: boolean) => {
                    if (!visible) {
                        onClose();
                    }
                }}
                transparentBackground={false}
            >
                <div className="sensible-schedule-popup-inner">
                    {!showConfirmation && (
                        <>
                            <h2>Select Schedule Dates</h2>
                            <button className="close-button" onClick={onClose}>
                                &times;
                            </button>
                            <div className="date-picker-container">
                                <div className="date-picker-header">Start Date:</div>
                                <SimpleDatePicker
                                    title="Start Date"
                                    currentDate={startDate}
                                    onChange={(date: Date) => setStartDate(date)}
                                />
                                <div className="date-picker-header">Due Date:</div>
                                <SimpleDatePicker
                                    title="Due Date"
                                    currentDate={dueDate}
                                    onChange={(date: Date) => setDueDate(date)}
                                />
                            </div>
                            <button className="schedule-button" onClick={handleGenerateSchedule}>
                                Generate Schedule
                            </button>
                        </>
                    )}

                    {showConfirmation && (
                        <div className="confirmation-section">
                            <h2>Confirm Schedule</h2>
                            {loading ? (
                                <p>Loading schedule data...</p>
                            ) : error ? (
                                <p>Error: {error}</p>
                            ) : (
                                renderSuggestedSchedule()
                            )}
                            <div className="confirmation-button">
                                <button className="schedule-button" onClick={handleRejectPlan}>
                                    Reject Plan
                                </button>
                                <button
                                    className="schedule-button"
                                    onClick={handleAcceptPlan}
                                    disabled={loading || !!error}
                                >
                                    {updateLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        "Accept Plan"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Popup>

            {/* Success Popup */}
            {showSuccessPopup && (
                <Popup
                    icon={<span style={{ display: "none" }} />}
                    buttonClassName="hidden-button"
                    contentClassName="success-popup-content"
                    title="Success"
                    isVisible={true}
                    setIsVisible={(visible: boolean) => {
                        if (!visible) {
                            setShowSuccessPopup(false);
                            onClose();
                        }
                    }}
                    transparentBackground={false}
                >
                    <div className="success-popup-inner">
                        <h2>Schedule Updated Successfully!</h2>
                        <button className="close-button" onClick={() => setShowSuccessPopup(false)}>
                            Close
                        </button>
                    </div>
                </Popup>
            )}

            {/* Error Popup */}
            {showErrorPopup && (
                <Popup
                    icon={<span style={{ display: "none" }} />}
                    buttonClassName="hidden-button"
                    contentClassName="error-popup-content"
                    title="Error"
                    isVisible={true}
                    setIsVisible={(visible: boolean) => {
                        if (!visible) {
                            setShowErrorPopup(false);
                        }
                    }}
                    transparentBackground={false}
                >
                    <div className="error-popup-inner">
                        <h2>An Error Occurred</h2>
                        <p>{updateError || "Failed to update the schedule. Please try again."}</p>
                        <button className="close-button" onClick={() => setShowErrorPopup(false)}>
                            Close
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default SensibleSchedulePopup;
