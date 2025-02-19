// EventBlock.tsx
import React from "react";
import { Event } from "../../../../../../types/Event"; // Adjust the import path as necessary

type EventBlockProps = {
    event: Event;
    onClick: (event: Event) => void; // Callback when the block is clicked
};

const EventBlock: React.FC<EventBlockProps> = ({ event, onClick }) => {
    return (
        <div
            className="event-block"
            style={{ backgroundColor: event.color }} // Or any other styling logic
            onClick={(e) => {
                e.stopPropagation(); // Prevent bubbling up to the day cell
                onClick(event); // Call the onClick handler with the event
            }}
        >
            {event.title} {/* Localize title if needed */}
        </div>
    );
};

export default EventBlock;
