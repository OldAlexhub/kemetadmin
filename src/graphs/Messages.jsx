import React, { useEffect, useState } from "react";
import axios from "axios";

const MessagesGraphs = () => {
  const [messages, setMessages] = useState([]);

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

  return (
    <div className="messages-dashboard">
      {messages.length > 0 ? (
        <div>
          {messages.map((message, index) => (
            <div key={index} className="message-item">
              <h3>{message.name}</h3>
              <p>{message.concern}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default MessagesGraphs;
