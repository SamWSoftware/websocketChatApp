import { useState } from "react";

export const MessageInterface = ({
  messages,
  sendMessage,
}: {
  messages: any[];
  sendMessage: (message: string) => void;
}) => {
  const [reply, setReply] = useState("");

  const submit = () => {
    sendMessage(reply);
    setReply("");
  };

  return (
    <div className="messageInterface">
      <div className="messageView">
        {messages.map((message) => {
          if (message.type == "info") {
            return <div>{message.message}</div>;
          }
          if (message.mine) {
            return <div className={`message right`}>{message.message}</div>;
          } else {
            return (
              <div className={`message left`}>
                {`${message.from} - ${message.message}`}
              </div>
            );
          }
        })}
      </div>
      <div className="messsageInput">
        <input
          type="text"
          onChange={(e) => setReply(e.target.value)}
          value={reply}
        />
        <button onClick={() => submit()}>Send</button>
      </div>
    </div>
  );
};
