import React from "react";
import "./BookingList.css";

function BookingList(props) {
  return (
    <ul className="bookings__list">
      {props.bookings.map((booking) => {
        return (
          <li className="bookings__item" key={booking._id}>
            <div className="bookings__item-data">
              <span className="bookings__item-data-title">
                {booking.event.title}
              </span>
              <span className="bookings__item-data-date">
                {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="bookings__item-actions">
              <button onClick={() => props.onDelete(booking._id)}>
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default BookingList;
