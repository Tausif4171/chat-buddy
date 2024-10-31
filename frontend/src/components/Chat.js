import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Chat = ({ receiverId }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    console.log("User ID:", user.id);
    console.log("Receiver ID:", receiverId);

    const fetchMessages = async () => {
      if (!user.id || !receiverId) {
        console.error("User ID or Receiver ID is undefined.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5002/api/messages/${user.id}/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.error(
          "Error fetching messages:",
          error.response?.data || error.message
        );
      }
    };

    fetchMessages();

    // Establish WebSocket connection
    socket.current = new WebSocket(`ws://localhost:5002?token=${token}`);

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => socket.current.close();
  }, [receiverId, token, user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      const message = {
        sender: user.id,
        receiver: receiverId,
        content: input,
      };
      socket.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.content}{" "}
            <em>{msg.timestamp}</em>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
