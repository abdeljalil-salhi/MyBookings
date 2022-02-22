import React, { useContext, useEffect, useState } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList";
import Modal from "../components/Modal/Modal";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/authContext";
import "./Events.css";

function Events() {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isActive, setIsActive] = useState(true);

  const context = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    return () => {
      setIsActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartCreateEvent = () => {
    setCreating(true);
  };

  const handleModalConfirm = () => {
    setCreating(false);
    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {
            title: $title
            description: $desc
            price: $price
            date: $date
          }) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title: title,
        desc: description,
        price: Math.abs(Number(price)),
        date: date,
      },
    };

    const token = context.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed.");
        }
        return res.json();
      })
      .then((resData) => {
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleModalCancel = () => {
    setCreating(false);
    setSelectedEvent();
  };

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
            }
          }
        }
      `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed.");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        if (isActive) {
          setEvents(events);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (isActive) {
          setIsLoading(false);
        }
      });
  };

  const handleShowDetails = (eventId) => {
    setSelectedEvent(events.find((e) => e._id === eventId));
  };

  const handleBookEvent = () => {
    if (!context.token) {
      setSelectedEvent();
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: selectedEvent._id,
      },
    };

    const token = context.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed.");
        }
        return res.json();
      })
      .then((resData) => {
        setSelectedEvent();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {creating && (
        <>
          <Backdrop />
          <Modal
            title={"Add Event"}
            canCancel
            canConfirm
            onCancel={handleModalCancel}
            onConfirm={handleModalConfirm}
            confirmText={"Confirm"}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </form>
          </Modal>
        </>
      )}
      {selectedEvent && (
        <>
          <Backdrop />
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={handleModalCancel}
            onConfirm={handleBookEvent}
            confirmText={context.token ? "Book" : "Confirm"}
          >
            <div>
              <span className="event__list-item-price">
                $ {selectedEvent.price} -{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </span>
              <br />
              <p>{selectedEvent.description}</p>
            </div>
          </Modal>
        </>
      )}
      <br />
      {context.token && (
        <div className="events-control">
          <p>Share your own events !</p>
          <button className="events-create" onClick={handleStartCreateEvent}>
            Create event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={context.userId}
          onViewDetails={handleShowDetails}
        />
      )}
    </>
  );
}

export default Events;
