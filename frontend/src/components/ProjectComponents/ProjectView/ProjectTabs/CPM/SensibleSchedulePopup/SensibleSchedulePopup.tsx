import React, { useState } from "react";
import SimpleDatePicker from "../../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import "./SensibleSchedulePopup.css";

interface SensibleSchedulePopupProps {
    onClose: () => void;
}

const SensibleSchedulePopup: React.FC<SensibleSchedulePopupProps> = ({ onClose }) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [startDate, setStartDate] = useState<string>(today.toISOString());
    const [dueDate, setDueDate] = useState<string>(tomorrow.toISOString());
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [suggestedScheduleData, setSuggestedScheduleData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchScheduleData = async (wanted_start: string, wanted_end: string) => {
        setIsLoading(true);
        setFetchError(null);
        try {
            // Replace the base URL with your backend host if needed.
            const response = await fetch(
                `http://localhost:8000/project/1/sensible_scheduling?wanted_start=${wanted_start}&wanted_end=${wanted_end}`
            );
            const data = await response.json();
            setSuggestedScheduleData(data);
        } catch (error: any) {
            console.error("Error fetching Schedule data:", error);
            setFetchError(error.message || "Error fetching data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSchedule = () => {
        // Extract only the date part (YYYY-MM-DD) from the ISO string.
        const wanted_start = startDate.split("T")[0];
        const wanted_end = dueDate.split("T")[0];

        // Open the confirmation popup and fetch data from the endpoint.
        setShowConfirmation(true);
        fetchScheduleData(wanted_start, wanted_end);
    };

    const handleAcceptPlan = () => {
        console.log("Accepting plan with Schedule data response:", suggestedScheduleData);
        setShowConfirmation(false);
        onClose();
    };

    const handleRejectPlan = () => {
        // Close the confirmation popup to let the user adjust dates if needed.
        setShowConfirmation(false);
    };

    return (
        <>
            <div className="popup-overlay">
                <div className="popup-content">
                    <button className="close-button, schedule-button" onClick={onClose}>
                        &times;
                    </button>
                    <h2>Select Schedule Dates</h2>
                    <div className="date-picker-container">
                        <div className="date-picker-header">Start Date:</div>
                        <SimpleDatePicker
                            title="Start Date"
                            currentDate={startDate}
                            onChange={(date: Date) => setStartDate(date.toISOString())}
                        />
                        <div className="date-picker-header">Due Date:</div>
                        <SimpleDatePicker
                            title="Due Date"
                            currentDate={dueDate}
                            onChange={(date: Date) => setDueDate(date.toISOString())}
                        />
                    </div>
                    <button className='schedule-button' onClick={handleGenerateSchedule}>Generate Schedule</button>
                </div>
            </div>

            {showConfirmation && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Confirm Schedule</h2>
                        {isLoading ? (
                            <p>Loading Schedule Data...</p>
                        ) : fetchError ? (
                            <p>Error: {fetchError}</p>
                        ) : (
                            <pre>{JSON.stringify(suggestedScheduleData, null, 2)}</pre>
                        )}
                        <div className="confirmation-button">
                            <button className='schedule-button' onClick={handleRejectPlan}>Reject Plan</button>
                            <button className='schedule-button' onClick={handleAcceptPlan} disabled={isLoading || !!fetchError}>
                                Accept Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SensibleSchedulePopup;
