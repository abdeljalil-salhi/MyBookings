import React from "react";
import "./EventItem.css";

function EventItem({ event, userId, onDetails }) {
  return (
    <li key={event._id} className="event__list-item">
      <div>
        <span className="event__list-item-title">{event.title}</span>
        <span className="event__list-item-price">
          $ {event.price} - {new Date(event.date).toLocaleDateString()}
        </span>
        <br />
        <small>{event.description}</small>
      </div>
      <div>
        {userId === event.creator._id ? (
          <p>
            <i>You are the owner of this event.</i>
          </p>
        ) : (
          <button onClick={() => onDetails(event._id)}>View details</button>
        )}
      </div>
    </li>
  );
}

export default EventItem;
