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

    // Use the useFetchProjectSuggestedSchedule hook
    const { fetchSuggestedSchedule, loading, error, data: suggestedScheduleData } = useFetchProjectSuggestedSchedule();

    const handleGenerateSchedule = () => {
        // Using date-fns format to ensure the dates are in "YYYY-MM-DD" format.
        const wanted_start = format(startDate, "yyyy-MM-dd");
        const wanted_end = format(dueDate, "yyyy-MM-dd");

        setShowConfirmation(true);
        fetchSuggestedSchedule(project_id, wanted_start, wanted_end);
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
                        {loading ? (
                            <p>Loading schedule data...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
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
                                disabled={loading || !!error}
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
