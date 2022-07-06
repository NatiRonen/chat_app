import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
function Chat(props) {
  const { socket, userName, room } = props;
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={userName === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    {messageContent.message}
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            //enter key trigers send message
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>send</button>
      </div>
      {/* <br /> */}
      <button
        className="btn btn-danger mt-2"
        onClick={() => props.setShowChat(false)}
      >
        Quit this chat
      </button>
    </div>
  );
}

export default Chat;
