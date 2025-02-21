import { useState } from "react";
import SimpleDatePicker from "../../../../GenericComponents/SimpleDatePicker/SimpleDatePicker";
import "./SchedulePopup.css";

const SchedulePopup = () => {
    // Store dates as ISO strings (or null). Initial values can be changed as needed.
    const [startDate, setStartDate] = useState<string | null>("2021-01-01");
    const [endDate, setEndDate] = useState<string | null>("2021-01-31");

    const handlePrintDates = () => {
        console.log("Chosen Start Date:", startDate);
        console.log("Chosen End Date:", endDate);
    };

    const handleConfirm = () => {
        console.log("the confirm button has been clicked");
    };

    return (
        <div className="schedule-popup">
            <div className="schedule-popup-header">
                <h2>Schedule Planner</h2>
            </div>

            <div className="schedule-popup-body">
                <div className="schedule-field">
                    <div className="schedule-field-header">Start Date:</div>
                    <SimpleDatePicker
                        currentDate={startDate}
                        title="Edit Start Date"
                        onChange={(newDate: Date | null) =>
                            setStartDate(newDate ? newDate.toISOString() : null)
                        }
                    />
                </div>

                <div className="schedule-field">
                    <div className="schedule-field-header">End Date:</div>
                    <SimpleDatePicker
                        currentDate={endDate}
                        title="Edit End Date"
                        onChange={(newDate: Date | null) =>
                            setEndDate(newDate ? newDate.toISOString() : null)
                        }
                    />
                </div>
            </div>

            <div className="schedule-popup-footer">
                <button className="schedule-button print-button" onClick={handlePrintDates}>
                    Print Dates
                </button>
                <button className="schedule-button confirm-button" onClick={handleConfirm}>
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default SchedulePopup;
