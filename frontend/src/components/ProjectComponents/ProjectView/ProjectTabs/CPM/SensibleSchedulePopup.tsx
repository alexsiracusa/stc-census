import React, { useState } from "react";
import SimpleDatePicker from "../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
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

    const handleGenerateSchedule = () => {
        // Open the confirmation popup instead of logging immediately.
        setShowConfirmation(true);
    };

    const handleAcceptPlan = () => {
        console.log("Accepting plan with start date:", startDate, "and due date:", dueDate);
        setShowConfirmation(false);
        onClose();
    };

    const handleRejectPlan = () => {
        // Simply close the confirmation popup and allow the user to change dates.
        setShowConfirmation(false);
    };

    return (
        <>
            <div className="popup-overlay">
                <div className="popup-content">
                    <button className="close-button" onClick={onClose}>
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
                    <button onClick={handleGenerateSchedule}>Generate Schedule</button>
                </div>
            </div>

            {showConfirmation && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Confirm Schedule</h2>
                        <p>
                            <strong>Start Date:</strong> {startDate}
                        </p>
                        <p>
                            <strong>Due Date:</strong> {dueDate}
                        </p>
                        <div className="confirmation-buttons">
                            <button onClick={handleRejectPlan}>Reject Plan</button>
                            <button onClick={handleAcceptPlan}>Accept Plan</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SensibleSchedulePopup;
