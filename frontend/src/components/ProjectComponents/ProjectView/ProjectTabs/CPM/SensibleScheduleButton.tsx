import React, { useState } from "react";
import SensibleSchedulePopup from "./SensibleSchedulePopup.tsx";
// import "./SensibleScheduleButton.css";

interface SensibleScheduleButtonProps {
    props: any; // Replace with TabProps if you want to type it more strictly.
}

const SensibleScheduleButton: React.FC<SensibleScheduleButtonProps> = ({ props: any }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div>
            <button onClick={openPopup}>Sensible Schedule</button>
            {isPopupOpen && <SensibleSchedulePopup onClose={closePopup} />}
        </div>
    );
};

export default SensibleScheduleButton;
