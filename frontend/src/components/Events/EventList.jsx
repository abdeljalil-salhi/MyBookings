import React from "react";
import EventItem from "./EventList/EventItem";
import "./EventList.css";

function EventList(props) {
  return (
    <ul className="event__list">
      {props.events.map((event) => {
        return (
          <EventItem
            key={event._id}
            event={event}
            userId={props.authUserId}
            onDetails={props.onViewDetails}
          />
        );
      })}
    </ul>
  );
}

export default EventList;
