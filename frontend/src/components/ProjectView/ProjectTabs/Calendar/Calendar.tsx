import './Calendar.css'

import TabProps from "../TabProps.ts";

const Calendar = (props: TabProps) => {
    return (
        <div>Calendar {props.project['id']}</div>
    )
};

export default Calendar;