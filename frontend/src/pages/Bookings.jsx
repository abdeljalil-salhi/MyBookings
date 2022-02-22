import React, { useContext, useEffect, useState } from "react";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls/BookingsControls";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/authContext";

function Bookings() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState("list");

  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
                _id
                title
                date
                price
            }
          }
        }
      `,
    };

    const token = context.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${token}`,
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
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleDeleteBooking = (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId,
      },
    };

    const token = context.token;

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${token}`,
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
        setBookings(
          bookings.filter((booking) => {
            return booking._id !== bookingId;
          })
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const changeOutputType = (outputType) => {
    if (outputType === "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <BookingsControls
            activeOutputType={outputType}
            changeOutputType={changeOutputType}
          />
          <div>
            {outputType === "list" ? (
              <>
                <br />
                <BookingList
                  bookings={bookings}
                  onDelete={handleDeleteBooking}
                />
              </>
            ) : (
              <>
                <br />
                <BookingsChart bookings={bookings} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Bookings;
