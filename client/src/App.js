import "./App.css";
import io from "socket.io-client";
import react, { useEffect, useState } from "react";
import Chat from "./comps/chat";

//change to const variable
const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {console.log("from app")}
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a chat</h3>
          <input
            type="text"
            placeholder="john..."
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className="btn" onClick={joinRoom}>
            Join a room
          </button>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} room={room} />
      )}
    </div>
  );
}

export default App;
