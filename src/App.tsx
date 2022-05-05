import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { JoinOrCreate } from "./views/JoinOrCreate";
import { MessageInterface } from "./views/MessageInterface";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [typingUrl, setTypingUrl] = useState("");

  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  const [joined, setJoined] = useState(false);

  const websocketConnect = () => {
    console.log("connect clicked");
    if (!typingUrl) return;

    const ws = new WebSocket(typingUrl);

    setSocket(ws);
  };

  socket?.addEventListener("message", function (event) {
    console.log("message Received ", event.data);
    try {
      const messageData = JSON.parse(event.data);
      console.log("messageData", messageData);
      if (messageData.type == "err") {
        toast(messageData.message);
        setJoined(false);
        return;
      }

      setMessages([...messages, messageData]);
    } catch (e) {
      setMessages([...messages, event.data]);
    }
  });
  socket?.addEventListener("close", function (event) {
    console.log("Websocket disconnected");
    setSocket(undefined);
    setJoined(false);
  });

  const joinOrCreate = (data: {
    name: string;
    action: string;
    roomCode?: string;
  }) => {
    socket?.send(JSON.stringify(data));
    setJoined(true);
  };

  const sendMessage = (message: string) => {
    const data = {
      action: "message",
      message,
    };

    socket?.send(JSON.stringify(data));
    setMessages([...messages, { message, mine: true }]);
  };

  return (
    <div className="App">
      <ToastContainer />
      {!socket ? (
        <>
          <input
            onChange={(e) => setTypingUrl(e.target.value)}
            value={typingUrl}
          />
          <button onClick={() => websocketConnect()}>Connect</button>
        </>
      ) : joined ? (
        <MessageInterface messages={messages} sendMessage={sendMessage} />
      ) : (
        <JoinOrCreate onSubmit={(data) => joinOrCreate(data)} />
      )}
    </div>
  );
}

export default App;
