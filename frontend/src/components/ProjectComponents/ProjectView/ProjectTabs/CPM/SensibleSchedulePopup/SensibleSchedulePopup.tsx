import React, { useState } from "react";
import SimpleDatePicker from "../../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker";
import Popup from "../../../../../GenericComponents/Popup/Popup.tsx";
import "./SensibleSchedulePopup.css";

interface SensibleSchedulePopupProps {
    onClose: () => void;
}

const SensibleSchedulePopup: React.FC<SensibleSchedulePopupProps> = ({ onClose }) => {
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
        setIsLoading(true);
        setFetchError(null);
        try {
            // Replace the URL with your actual backend host if needed.
            const response = await fetch(
                `http://localhost:8000/project/1/sensible_scheduling?wanted_start=${wanted_start}&wanted_end=${wanted_end}`
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
        // Convert the Date objects into the YYYY-MM-DD string format.
        const wanted_start = startDate.toISOString().split("T")[0];
        const wanted_end = dueDate.toISOString().split("T")[0];

        setShowConfirmation(true);
        fetchScheduleData(wanted_start, wanted_end);
    };

    const handleAcceptPlan = () => {
        console.log("Accepting plan with schedule data:", suggestedScheduleData);
        setShowConfirmation(false);
        onClose();
    };

    const handleRejectPlan = () => {
        setShowConfirmation(false);
    };

    return (
        <Popup
            // Pass an empty element as the icon to hide the built-in toggle button.
            icon={<span style={{ display: "none" }} />}
            buttonClassName="hidden-button" // Use CSS to hide or minimize the built-in button.
            contentClassName="sensible-schedule-popup-content"
            title="Select Schedule Dates"
            isVisible={true} // The popup is controlled externally.
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
