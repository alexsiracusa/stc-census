import { useState } from "react";
import Popup from "../../../../GenericComponents/Popup/Popup.tsx";
import SchedulePopup from "./SchedulePopup";
import "./SensibleScheduleButton.css";
import TabProps from "../TabProps.ts";

const SensibleScheduleButton = (props: TabProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Popup
            icon={<span>Schedule</span>}
            buttonClassName="sensible-schedule-button"
            contentClassName="schedule-popup-content"
            title="Schedule Planner"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            transparentBackground={true}
        >
            <SchedulePopup />
        </Popup>
    );
};

export default SensibleScheduleButton;
