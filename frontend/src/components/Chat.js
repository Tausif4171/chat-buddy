import React, { useEffect, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5002");

    socket.onmessage = (event) => {
      const { data } = event;

      // Check if data is a Blob
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const message = JSON.parse(reader.result);
            setMessages((prevMessages) => [...prevMessages, message]);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(data);
      } else {
        // If data is not a Blob, parse as JSON directly
        try {
          const message = JSON.parse(data);
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      const socket = new WebSocket("ws://localhost:5002");
      socket.onopen = () => {
        socket.send(JSON.stringify({ content: input }));
        setInput("");
      };
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
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
