import { useState } from "react";

interface Props {
  onSubmit: ({
    name,
    action,
    roomCode,
  }: {
    name: string;
    action: string;
    roomCode?: string;
  }) => void;
}

export const JoinOrCreate = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const join = () => {
    onSubmit({
      name,
      action: "joinRoom",
      roomCode,
    });
  };
  const create = () => {
    onSubmit({
      name,
      action: "createRoom",
    });
  };

  return (
    <div>
      <div>
        <h2>Create Room</h2>
        <div>
          <span>Your Name</span>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <button onClick={() => create()}>Create</button>
      </div>
      <div>
        <h2>Join Existing Room</h2>
        <div>
          <span>Your Name</span>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <span>Room Code</span>
          <input type="text" onChange={(e) => setRoomCode(e.target.value)} />
        </div>
        <button onClick={() => join()}>Join</button>
      </div>
    </div>
  );
};
