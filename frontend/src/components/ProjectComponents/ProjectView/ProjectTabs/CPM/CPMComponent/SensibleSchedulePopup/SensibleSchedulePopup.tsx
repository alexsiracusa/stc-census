import "./SensibleSchedulePopup.css";

import React, { useState } from "react";
import { format } from "date-fns";
import SimpleDatePicker from "../../../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import Popup from "../../../../../../GenericComponents/Popup/Popup.tsx";

import useFetchProjectSuggestedSchedule from "../../../../../../../hooks/useFetchProjectSuggestedSchedule.ts";
import useUpdateProjectSchedule from "../../../../../../../hooks/useUpdateProjectSchedule.ts";

interface SensibleSchedulePopupProps {
    onClose: () => void;
    project_id: number;
}

const SensibleSchedulePopup: React.FC<SensibleSchedulePopupProps> = ({ onClose, project_id }) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [startDate, setStartDate] = useState<Date>(today);
    const [dueDate, setDueDate] = useState<Date>(tomorrow);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [suggestedScheduleData, setSuggestedScheduleData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchScheduleData = async (wanted_start: string, wanted_end: string) => {
        // wanted_start and wanted_end are now in the "YYYY-MM-DD" format
        setIsLoading(true);
        setFetchError(null);
        try {
            const response = await fetch(
                `http://localhost:8000/project/${project_id}/sensible_scheduling?wanted_start=${wanted_start}&wanted_end=${wanted_end}`
            );
            const data = await response.json();
            setSuggestedScheduleData(data);
        } catch (error: any) {
            console.error("Error fetching schedule data:", error);
            setFetchError(error.message || "Error fetching data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSchedule = () => {
        // Using date-fns format to ensure the dates are in "YYYY-MM-DD" format.
        const wanted_start = format(startDate, "yyyy-MM-dd");
        const wanted_end = format(dueDate, "yyyy-MM-dd");

        setShowConfirmation(true);
        fetchScheduleData(wanted_start, wanted_end);
    };

    const handleAcceptPlan = () => {
        console.log("Accepting plan with schedule data:", suggestedScheduleData);
        // {} = useUpdateProjectSchedule(props.project_id);
        setShowConfirmation(false);
        onClose();
    };

    const handleRejectPlan = () => {
        setShowConfirmation(false);
    };

    return (
        <Popup
            icon={<span style={{ display: "none" }} />}
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
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Select Schedule Dates</h2>
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
                {!showConfirmation && (
                    <button className="schedule-button" onClick={handleGenerateSchedule}>
                        Generate Schedule
                    </button>
                )}

                {showConfirmation && (
                    <div className="confirmation-section">
                        <h2>Confirm Schedule</h2>
                        {isLoading ? (
                            <p>Loading schedule data...</p>
                        ) : fetchError ? (
                            <p>Error: {fetchError}</p>
                        ) : (
                            <pre>{JSON.stringify(suggestedScheduleData, null, 2)}</pre>
                        )}
                        <div className="confirmation-button">
                            <button className="schedule-button" onClick={handleRejectPlan}>
                                Reject Plan
                            </button>
                            <button
                                className="schedule-button"
                                onClick={handleAcceptPlan}
                                disabled={isLoading || !!fetchError}
                            >
                                Accept Plan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Popup>
    );
};

export default SensibleSchedulePopup;
