import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Navbar from "./components/Navbar";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("you are connected to " + socket.id);
});

function App() {
  const [room, setRoom] = useState(() => {
    let roomName = "Home";
    socket.emit("change-room", roomName);
    return roomName;
  });

  const [messages, setMessages] = useState([]);

  const [inputs, setInputs] = useState({
    message: "",
    roomId: "",
  });

  useEffect(() => {
    console.log("sent message");
    let handler = (message) => {
      setMessages((currentMessages) => [...currentMessages, message]);
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler);
    };
  }, []);

  const handleChange = (event) => {
    setInputs((prev) => {
      const { name, value } = event.target;
      if (name === "messageInput") {
        return { ...prev, message: value };
      } else if (name === "roomInput") {
        return { ...prev, roomId: value };
      }
    });
  };

  const handleMessaging = () => {
    const { message } = inputs;

    if (message === "") return;

    setMessages((currentMessages) => {
      socket.emit("send-message", message, room);
      return [...currentMessages, message];
    });

    setInputs((prev) => {
      return { ...prev, message: "" };
    });
  };

  const handleRooms = () => {
    if (inputs.roomId === "") return;

    socket.emit("change-room", inputs.roomId);
    setRoom(inputs.roomId);

    setInputs((prev) => {
      return { ...prev, roomId: "" };
    });
  };

  return (
    <>
      <Navbar />
      <div className="content">
        <h1>Current Room: {room}</h1>

        <div className="message-box">
          {messages.map((message) => (
            <div key={crypto.randomUUID()} className="message-block">
              {message}
            </div>
          ))}
        </div>

        <div className="input-group">
          <input
            onChange={handleChange}
            name="messageInput"
            value={inputs.message}
            type="text"
            className="text-box"
            placeholder="Enter your message..."
          />
          <button onClick={handleMessaging} className="btn">
            Send
          </button>
        </div>

        <div className="input-group">
          <input
            onChange={handleChange}
            name="roomInput"
            value={inputs.roomId}
            type="text"
            className="text-box"
            placeholder="Enter room number..."
          />
          <button onClick={handleRooms} className="btn">
            Join
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
