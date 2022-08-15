import { useState } from "react";
import { Modal } from "../components/Modal";

interface Props {
  onSubmit: ({
    action,
    groupName,
  }: {
    action: string;
    groupName: string;
  }) => void;
}

export const CreateGroup = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const create = () => {
    onSubmit({
      groupName: name,
      action: "createGroup",
    });
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <h2>Create Group</h2>
        <div>
          <span>Group Name</span>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <button onClick={() => create()}>Create</button>
      </Modal>
      <button onClick={() => setShowModal(true)} style={{ marginLeft: "15px" }}>
        Create New Group
      </button>
    </>
  );
};
