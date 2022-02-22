import React from "react";
import "./BookingsControls.css";

function BookingsControls(props) {
  return (
    <div className="bookings-control">
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={() => props.changeOutputType("list")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={() => props.changeOutputType("chart")}
      >
        Chart
      </button>
    </div>
  );
}

export default BookingsControls;
