import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { user, token } = useContext(AuthContext); // Get the token from AuthContext
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish WebSocket connection with token
    const ws = new WebSocket(`ws://localhost:5003?token=${token}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => ws.close();
  }, [token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      socket.send(
        JSON.stringify({
          username: user.username,
          content: input,
        })
      );
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.content}{" "}
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
