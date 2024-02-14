import React, { useEffect, useState } from "react";
import Logo from "../images/logo.png";
import axios from "axios";

const Communications = () => {
  const [messages, setMessages] = useState([]);
  const [filterBookingId, setFilterBookingId] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_MY_MESSAGES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data.show);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

  // Filter messages based on bookingId
  const filteredMessages = filterBookingId
    ? messages.filter((msg) => String(msg.bookingId).includes(filterBookingId))
    : messages;

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" className="mb-3" />
        <h3>Customer Messages</h3>
        <input
          type="text"
          className="form-control mt-3"
          placeholder="Filter by Booking ID"
          value={filterBookingId}
          onChange={(e) => setFilterBookingId(e.target.value)}
        />
      </div>
      <ul className="list-unstyled">
        {filteredMessages.map((msg) => (
          <li key={msg._id} className="mb-3">
            <div className="p-3 border rounded">
              <p>
                <strong>Name:</strong> {msg.name}
              </p>
              <p>
                <strong>Email:</strong> {msg.email}
              </p>
              <p>
                <strong>Phone:</strong> {msg.phone}
              </p>
              <p>
                <strong>Booking ID:</strong> {msg.bookingId}
              </p>
              <p>
                <strong>Concern:</strong> {msg.concern}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Communications;
