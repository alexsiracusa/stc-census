import "./SensibleScheduleButton.css";

import React, { useState } from "react";
import SensibleSchedulePopup from "../SensibleSchedulePopup/SensibleSchedulePopup.tsx";

interface SensibleScheduleButtonProps {
    props: any;
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
            <button className='schedule-button' onClick={openPopup}>Sensible Schedule</button>
            {isPopupOpen && <SensibleSchedulePopup onClose={closePopup} />}
        </div>
    );
};

export default SensibleScheduleButton;
